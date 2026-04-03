
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const ADMIN_USERNAME = Deno.env.get('ADMIN_USERNAME')!
const ADMIN_PASSWORD = Deno.env.get('ADMIN_PASSWORD')!

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
    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Public list endpoint - no auth required
    if (path === 'list-public' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('date', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // All other endpoints require auth
    if (!verifyAdminToken(req)) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Admin list
    if (path === 'list' && req.method === 'GET') {
      const { data, error } = await supabase
        .from('galleries')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Create gallery
    if (path === 'create' && req.method === 'POST') {
      const body = await req.json()
      const { title, date, images } = body

      if (!title || !date) {
        return new Response(JSON.stringify({ error: 'Title and date required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('galleries')
        .insert({ title, date, images: images || [] })
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Update gallery
    if (path === 'update' && (req.method === 'PUT' || req.method === 'POST')) {
      const body = await req.json()
      const { id, ...updates } = body

      if (!id) {
        return new Response(JSON.stringify({ error: 'ID required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { data, error } = await supabase
        .from('galleries')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Delete gallery
    if (path === 'delete' && (req.method === 'DELETE' || req.method === 'POST')) {
      const { id } = await req.json()

      if (!id) {
        return new Response(JSON.stringify({ error: 'ID required' }), {
          status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        })
      }

      const { error } = await supabase
        .from('galleries')
        .delete()
        .eq('id', id)

      if (error) throw error
      return new Response(JSON.stringify({ success: true }), {
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
