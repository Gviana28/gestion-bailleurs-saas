import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Fonctions utilitaires pour l'authentification
export const auth = {
  signUp: async (email: string, password: string) => {
    return await supabase.auth.signUp({
      email,
      password,
    })
  },

  signIn: async (email: string, password: string) => {
    return await supabase.auth.signInWithPassword({
      email,
      password,
    })
  },

  signOut: async () => {
    return await supabase.auth.signOut()
  },

  getCurrentUser: async () => {
    const { data: { user } } = await supabase.auth.getUser()
    return user
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  }
}

// Fonctions pour la gestion des biens
export const biensService = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from('biens')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  create: async (bien: any) => {
    const { data, error } = await supabase
      .from('biens')
      .insert([bien])
      .select()
    
    if (error) throw error
    return data[0]
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('biens')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('biens')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Fonctions pour la gestion des locataires
export const locatairesService = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from('locataires')
      .select(`
        *,
        biens (
          nom,
          adresse
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  create: async (locataire: any) => {
    const { data, error } = await supabase
      .from('locataires')
      .insert([locataire])
      .select()
    
    if (error) throw error
    return data[0]
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('locataires')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('locataires')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  }
}

// Fonctions pour la gestion des échéances
export const echeancesService = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from('echeances')
      .select(`
        *,
        biens (
          nom,
          adresse
        ),
        locataires (
          nom,
          prenom,
          email
        )
      `)
      .eq('user_id', userId)
      .order('date_echeance', { ascending: true })
    
    if (error) throw error
    return data
  },

  create: async (echeance: any) => {
    const { data, error } = await supabase
      .from('echeances')
      .insert([echeance])
      .select()
    
    if (error) throw error
    return data[0]
  },

  update: async (id: string, updates: any) => {
    const { data, error } = await supabase
      .from('echeances')
      .update(updates)
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  },

  delete: async (id: string) => {
    const { error } = await supabase
      .from('echeances')
      .delete()
      .eq('id', id)
    
    if (error) throw error
  },

  markAsPaid: async (id: string) => {
    const { data, error } = await supabase
      .from('echeances')
      .update({ 
        statut: 'payee',
        date_paiement: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Fonctions pour les utilisateurs et abonnements
export const usersService = {
  getProfile: async (userId: string) => {
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
    
    if (error) throw error
    return data
  },

  updateProfile: async (userId: string, updates: any) => {
    const { data, error } = await supabase
      .from('users')
      .update(updates)
      .eq('id', userId)
      .select()
    
    if (error) throw error
    return data[0]
  },

  createProfile: async (user: any) => {
    const { data, error } = await supabase
      .from('users')
      .insert([user])
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Fonctions pour les notifications
export const notificationsService = {
  getAll: async (userId: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data
  },

  create: async (notification: any) => {
    const { data, error } = await supabase
      .from('notifications')
      .insert([notification])
      .select()
    
    if (error) throw error
    return data[0]
  },

  markAsSent: async (id: string) => {
    const { data, error } = await supabase
      .from('notifications')
      .update({ 
        statut: 'envoye',
        date_envoi: new Date().toISOString()
      })
      .eq('id', id)
      .select()
    
    if (error) throw error
    return data[0]
  }
}

// Fonctions utilitaires
export const utils = {
  // Générer des échéances récurrentes pour les loyers
  generateRecurringRentPayments: async (locataireId: string, bienId: string, userId: string, montant: number, dateDebut: Date, nombreMois: number = 12) => {
    const echeances = []
    
    for (let i = 0; i < nombreMois; i++) {
      const dateEcheance = new Date(dateDebut)
      dateEcheance.setMonth(dateEcheance.getMonth() + i)
      
      echeances.push({
        user_id: userId,
        type: 'loyer',
        locataire_id: locataireId,
        bien_id: bienId,
        montant: montant,
        date_echeance: dateEcheance.toISOString(),
        statut: 'en_attente',
        description: `Loyer ${dateEcheance.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        recurrente: true,
        frequence_recurrence: 1
      })
    }
    
    const { data, error } = await supabase
      .from('echeances')
      .insert(echeances)
      .select()
    
    if (error) throw error
    return data
  },

  // Calculer les statistiques du dashboard
  calculateDashboardStats: async (userId: string) => {
    // Récupérer toutes les données nécessaires
    const [biens, locataires, echeances] = await Promise.all([
      biensService.getAll(userId),
      locatairesService.getAll(userId),
      echeancesService.getAll(userId)
    ])

    const maintenant = new Date()
    const debutMois = new Date(maintenant.getFullYear(), maintenant.getMonth(), 1)
    const finMois = new Date(maintenant.getFullYear(), maintenant.getMonth() + 1, 0)

    const stats = {
      nombreBiens: biens.length,
      nombreLocataires: locataires.filter((l: any) => l.statut === 'actif').length,
      revenuMensuel: locataires
        .filter((l: any) => l.statut === 'actif')
        .reduce((total: number, l: any) => total + l.montant_loyer, 0),
      echeancesEnAttente: echeances.filter((e: any) => e.statut === 'en_attente').length,
      echeancesEnRetard: echeances.filter((e: any) => {
        return e.statut === 'en_attente' && new Date(e.date_echeance) < maintenant
      }).length,
      echeancesCeMois: echeances.filter((e: any) => {
        const dateEcheance = new Date(e.date_echeance)
        return dateEcheance >= debutMois && dateEcheance <= finMois
      })
    }

    return stats
  }
}