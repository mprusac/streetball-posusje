
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ADMIN_USERNAME = Deno.env.get('ADMIN_USERNAME')!
const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')!

// Deterministic token based on credentials - verifiable across cold starts
function getExpectedToken(): string {
  const day = new Date().toISOString().slice(0, 10)
  const data = `${ADMIN_USERNAME}:${ADMIN_PASSWORD}:${day}`
  let hash = 0
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i)
    hash = ((hash << 5) - hash) + char
    hash = hash & hash
  }
  return `admin_${Math.abs(hash).toString(36)}_${day.replace(/-/g, '')}`
}

function verifyAdminToken(req: Request): boolean {
  const auth = req.headers.get('Authorization')
  if (!auth?.startsWith('Bearer admin_')) return false
  const token = auth.replace('Bearer ', '')
  return token === getExpectedToken()
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  const url = new URL(req.url)
  const path = url.pathname.split('/').pop()

  try {
    // Login endpoint
    if (path === 'login' && req.method === 'POST') {
      const { username, password } = await req.json()
      
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = getExpectedToken()
        return new Response(JSON.stringify({ token }), {
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }
      return new Response(JSON.stringify({ error: 'Invalid credentials' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // All other endpoints require auth
    if (!verifyAdminToken(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get all news
    if (path === 'list' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('news')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create news
    if (path === 'create' && req.method === 'POST') {
      const body = await req.json()
      const { title, excerpt, date, category, image_url, image_position, pinned } = body

      if (!title || !date) {
        return new Response(JSON.stringify({ error: 'Title and date required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('news')
        .insert({ title, excerpt, date, category: category || '2025', image_url, image_position: image_position || 'center', pinned: pinned || false })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update news
    if (path === 'update' && (req.method === 'PUT' || req.method === 'POST')) {
      const body = await req.json()
      const { id, ...updates } = body

      if (!id) {
        return new Response(JSON.stringify({ error: 'ID required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('news')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Delete news
    if (path === 'delete' && req.method === 'DELETE') {
      const { id } = await req.json()

      if (!id) {
        return new Response(JSON.stringify({ error: 'ID required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { error } = await supabase
        .from('news')
        .delete()
        .eq('id', id)

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Upload image - generate signed URL
    if (path === 'upload-url' && req.method === 'POST') {
      const { filename, contentType } = await req.json()
      const filePath = `${Date.now()}-${filename}`
      
      // Upload will be done client-side, just return the path
      return new Response(JSON.stringify({ path: filePath, bucket: 'news-images' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    return new Response(JSON.stringify({ error: 'Not found' }), {
      status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  } catch (err) {
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
