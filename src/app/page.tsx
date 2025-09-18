'use client'

import { useState, useEffect } from 'react'
import { Calendar, Home, Users, Clock, Plus, Settings, CreditCard, Bell, CheckCircle, AlertCircle, FileText, Download, Upload, Archive, Trash2, Eye, DollarSign, TrendingUp, BarChart3, PieChart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'

// Types
interface Bien {
  id: string
  nom: string
  adresse: string
  montantLoyer: number
  frequenceEntretien: number
  type?: 'appartement' | 'maison' | 'studio' | 'autre'
  surface?: number
  photos?: string[]
  documents?: Document[]
  createdAt: Date
}

interface Document {
  id: string
  nom: string
  type: 'contrat_bail' | 'etat_lieux_entree' | 'etat_lieux_sortie' | 'assurance' | 'autre'
  url: string
  dateUpload: Date
}

interface Locataire {
  id: string
  nom: string
  prenom?: string
  email: string
  telephone: string
  bienId: string
  dateEntree: Date
  dateSortie?: Date
  montantLoyer: number
  montantCharges?: number
  montantDepotGarantie?: number
  statut: 'actif' | 'ancien' | 'archive'
  dateArchivage?: Date
  raisonArchivage?: string
  createdAt: Date
}

interface Echeance {
  id: string
  type: 'loyer' | 'maintenance' | 'charges' | 'autre'
  locataireId?: string
  bienId: string
  montant: number
  dateEcheance: Date
  datePaiement?: Date
  statut: 'en_attente' | 'paye' | 'en_retard' | 'annule'
  description: string
  recurrente: boolean
  frequenceRecurrence?: number
  createdAt: Date
}

interface Paiement {
  id: string
  echeanceId: string
  locataireId?: string
  bienId: string
  montant: number
  datePaiement: Date
  methodePaiement?: 'virement' | 'cheque' | 'especes' | 'prelevement' | 'autre'
  referencePaiement?: string
  statut: 'en_attente' | 'confirme' | 'rejete' | 'rembourse'
  notes?: string
  createdAt: Date
}

interface User {
  id: string
  email: string
  plan: 'gratuit' | 'premium'
  dateInscription: Date
}

export default function GestionBailleurs() {
  // États principaux
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [biens, setBiens] = useState<Bien[]>([])
  const [locataires, setLocataires] = useState<Locataire[]>([])
  const [echeances, setEcheances] = useState<Echeance[]>([])
  const [paiements, setPaiements] = useState<Paiement[]>([])
  const [activeTab, setActiveTab] = useState('dashboard')

  // États pour les modales
  const [showBienModal, setShowBienModal] = useState(false)
  const [showLocataireModal, setShowLocataireModal] = useState(false)
  const [showEcheanceModal, setShowEcheanceModal] = useState(false)
  const [showPaiementModal, setShowPaiementModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(true)
  const [showRapportModal, setShowRapportModal] = useState(false)
  const [showArchiveModal, setShowArchiveModal] = useState(false)

  // États pour les formulaires
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [bienForm, setBienForm] = useState({ 
    nom: '', 
    adresse: '', 
    montantLoyer: '', 
    frequenceEntretien: '12',
    type: '',
    surface: ''
  })
  const [locataireForm, setLocataireForm] = useState({ 
    nom: '', 
    prenom: '',
    email: '', 
    telephone: '', 
    bienId: '', 
    dateEntree: '', 
    montantLoyer: '',
    montantCharges: '',
    montantDepotGarantie: ''
  })
  const [echeanceForm, setEcheanceForm] = useState({ 
    type: 'maintenance', 
    bienId: '', 
    locataireId: '',
    montant: '', 
    dateEcheance: '', 
    description: '',
    recurrente: false,
    frequenceRecurrence: '1'
  })
  const [paiementForm, setPaiementForm] = useState({
    echeanceId: '',
    montant: '',
    datePaiement: '',
    methodePaiement: 'virement',
    referencePaiement: '',
    notes: ''
  })

  // États pour les filtres
  const [filtreLocataires, setFiltreLocataires] = useState<'tous' | 'actif' | 'ancien' | 'archive'>('actif')
  const [filtreEcheances, setFiltreEcheances] = useState<'tous' | 'en_attente' | 'paye' | 'en_retard'>('tous')
  const [selectedLocataireArchive, setSelectedLocataireArchive] = useState<string>('')
  const [raisonArchivage, setRaisonArchivage] = useState('')

  // Données de démonstration
  useEffect(() => {
    if (isAuthenticated) {
      const demoUser: User = {
        id: '1',
        email: 'demo@example.com',
        plan: 'premium', // Changé en premium pour montrer toutes les fonctionnalités
        dateInscription: new Date()
      }
      
      const demoBiens: Bien[] = [
        {
          id: '1',
          nom: 'Appartement Centre-ville',
          adresse: '15 rue de la République, 75001 Paris',
          montantLoyer: 1200,
          frequenceEntretien: 12,
          type: 'appartement',
          surface: 65,
          photos: ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop'],
          documents: [
            {
              id: '1',
              nom: 'Contrat de bail - Marie Dupont',
              type: 'contrat_bail',
              url: '#',
              dateUpload: new Date()
            }
          ],
          createdAt: new Date()
        },
        {
          id: '2',
          nom: 'Maison Banlieue',
          adresse: '42 avenue des Lilas, 94000 Créteil',
          montantLoyer: 1800,
          frequenceEntretien: 6,
          type: 'maison',
          surface: 120,
          photos: ['https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=400&h=300&fit=crop'],
          createdAt: new Date()
        }
      ]
      
      const demoLocataires: Locataire[] = [
        {
          id: '1',
          nom: 'Dupont',
          prenom: 'Marie',
          email: 'marie.dupont@email.com',
          telephone: '06 12 34 56 78',
          bienId: '1',
          dateEntree: new Date('2024-01-01'),
          montantLoyer: 1200,
          montantCharges: 150,
          montantDepotGarantie: 2400,
          statut: 'actif',
          createdAt: new Date()
        },
        {
          id: '2',
          nom: 'Martin',
          prenom: 'Pierre',
          email: 'pierre.martin@email.com',
          telephone: '06 98 76 54 32',
          bienId: '2',
          dateEntree: new Date('2023-06-01'),
          dateSortie: new Date('2024-11-30'),
          montantLoyer: 1800,
          montantCharges: 200,
          statut: 'archive',
          dateArchivage: new Date('2024-12-01'),
          raisonArchivage: 'Fin de bail - déménagement',
          createdAt: new Date()
        }
      ]
      
      const demoEcheances: Echeance[] = [
        {
          id: '1',
          type: 'loyer',
          locataireId: '1',
          bienId: '1',
          montant: 1200,
          dateEcheance: new Date('2024-12-01'),
          statut: 'paye',
          datePaiement: new Date('2024-12-01'),
          description: 'Loyer décembre 2024',
          recurrente: true,
          frequenceRecurrence: 1,
          createdAt: new Date()
        },
        {
          id: '2',
          type: 'maintenance',
          bienId: '1',
          montant: 150,
          dateEcheance: new Date('2024-12-15'),
          statut: 'en_attente',
          description: 'Révision chaudière',
          recurrente: false,
          createdAt: new Date()
        },
        {
          id: '3',
          type: 'loyer',
          locataireId: '1',
          bienId: '1',
          montant: 1200,
          dateEcheance: new Date('2024-11-01'),
          statut: 'en_retard',
          description: 'Loyer novembre 2024',
          recurrente: true,
          frequenceRecurrence: 1,
          createdAt: new Date()
        }
      ]

      const demoPaiements: Paiement[] = [
        {
          id: '1',
          echeanceId: '1',
          locataireId: '1',
          bienId: '1',
          montant: 1200,
          datePaiement: new Date('2024-12-01'),
          methodePaiement: 'virement',
          referencePaiement: 'VIR-2024-12-001',
          statut: 'confirme',
          notes: 'Paiement reçu à temps',
          createdAt: new Date()
        }
      ]
      
      setUser(demoUser)
      setBiens(demoBiens)
      setLocataires(demoLocataires)
      setEcheances(demoEcheances)
      setPaiements(demoPaiements)
    }
  }, [isAuthenticated])

  // Fonctions d'authentification
  const handleLogin = () => {
    if (authForm.email && authForm.password) {
      setIsAuthenticated(true)
      setShowAuthModal(false)
    }
  }

  const handleLogout = () => {
    setIsAuthenticated(false)
    setUser(null)
    setBiens([])
    setLocataires([])
    setEcheances([])
    setPaiements([])
    setShowAuthModal(true)
  }

  // Fonctions CRUD pour les biens
  const handleAddBien = () => {
    if (user?.plan === 'gratuit' && biens.length >= 1) {
      alert('Plan gratuit limité à 1 bien. Passez au plan premium pour plus de biens.')
      return
    }
    
    const nouveauBien: Bien = {
      id: Date.now().toString(),
      nom: bienForm.nom,
      adresse: bienForm.adresse,
      montantLoyer: parseFloat(bienForm.montantLoyer),
      frequenceEntretien: parseInt(bienForm.frequenceEntretien),
      type: bienForm.type as 'appartement' | 'maison' | 'studio' | 'autre',
      surface: bienForm.surface ? parseFloat(bienForm.surface) : undefined,
      photos: [],
      documents: [],
      createdAt: new Date()
    }
    
    setBiens([...biens, nouveauBien])
    setBienForm({ nom: '', adresse: '', montantLoyer: '', frequenceEntretien: '12', type: '', surface: '' })
    setShowBienModal(false)
  }

  // Fonctions CRUD pour les locataires
  const handleAddLocataire = () => {
    if (user?.plan === 'gratuit' && locataires.filter(l => l.statut === 'actif').length >= 2) {
      alert('Plan gratuit limité à 2 locataires actifs. Passez au plan premium pour plus de locataires.')
      return
    }
    
    const nouveauLocataire: Locataire = {
      id: Date.now().toString(),
      nom: locataireForm.nom,
      prenom: locataireForm.prenom,
      email: locataireForm.email,
      telephone: locataireForm.telephone,
      bienId: locataireForm.bienId,
      dateEntree: new Date(locataireForm.dateEntree),
      montantLoyer: parseFloat(locataireForm.montantLoyer),
      montantCharges: locataireForm.montantCharges ? parseFloat(locataireForm.montantCharges) : undefined,
      montantDepotGarantie: locataireForm.montantDepotGarantie ? parseFloat(locataireForm.montantDepotGarantie) : undefined,
      statut: 'actif',
      createdAt: new Date()
    }
    
    setLocataires([...locataires, nouveauLocataire])
    setLocataireForm({ nom: '', prenom: '', email: '', telephone: '', bienId: '', dateEntree: '', montantLoyer: '', montantCharges: '', montantDepotGarantie: '' })
    setShowLocataireModal(false)

    // Générer automatiquement les échéances de loyer pour les 12 prochains mois
    generateRecurringRentPayments(nouveauLocataire)
  }

  // Fonction pour générer les échéances de loyer récurrentes
  const generateRecurringRentPayments = (locataire: Locataire) => {
    const nouvellesEcheances: Echeance[] = []
    const dateDebut = new Date(locataire.dateEntree)
    
    for (let i = 0; i < 12; i++) {
      const dateEcheance = new Date(dateDebut)
      dateEcheance.setMonth(dateEcheance.getMonth() + i)
      
      const echeance: Echeance = {
        id: `${Date.now()}-${i}`,
        type: 'loyer',
        locataireId: locataire.id,
        bienId: locataire.bienId,
        montant: locataire.montantLoyer,
        dateEcheance,
        statut: 'en_attente',
        description: `Loyer ${dateEcheance.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })}`,
        recurrente: true,
        frequenceRecurrence: 1,
        createdAt: new Date()
      }
      
      nouvellesEcheances.push(echeance)
    }
    
    setEcheances(prev => [...prev, ...nouvellesEcheances])
  }

  // Fonction pour archiver un locataire
  const handleArchiveLocataire = () => {
    if (!selectedLocataireArchive || !raisonArchivage) return
    
    setLocataires(prev => prev.map(locataire => 
      locataire.id === selectedLocataireArchive
        ? {
            ...locataire,
            statut: 'archive',
            dateArchivage: new Date(),
            raisonArchivage,
            dateSortie: new Date()
          }
        : locataire
    ))
    
    setSelectedLocataireArchive('')
    setRaisonArchivage('')
    setShowArchiveModal(false)
  }

  // Fonction pour supprimer définitivement un locataire (RGPD)
  const handleDeleteLocataireData = (locataireId: string) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer définitivement toutes les données de ce locataire ? Cette action est irréversible et conforme au droit à l\'effacement RGPD.')) {
      // Supprimer les paiements associés
      setPaiements(prev => prev.filter(p => p.locataireId !== locataireId))
      
      // Supprimer les échéances associées
      setEcheances(prev => prev.filter(e => e.locataireId !== locataireId))
      
      // Supprimer le locataire
      setLocataires(prev => prev.filter(l => l.id !== locataireId))
    }
  }

  // Fonctions pour les échéances
  const handleAddEcheance = () => {
    const nouvelleEcheance: Echeance = {
      id: Date.now().toString(),
      type: echeanceForm.type as 'loyer' | 'maintenance' | 'charges' | 'autre',
      bienId: echeanceForm.bienId,
      locataireId: echeanceForm.locataireId || undefined,
      montant: parseFloat(echeanceForm.montant),
      dateEcheance: new Date(echeanceForm.dateEcheance),
      statut: 'en_attente',
      description: echeanceForm.description,
      recurrente: echeanceForm.recurrente,
      frequenceRecurrence: echeanceForm.recurrente ? parseInt(echeanceForm.frequenceRecurrence) : undefined,
      createdAt: new Date()
    }
    
    setEcheances([...echeances, nouvelleEcheance])
    setEcheanceForm({ type: 'maintenance', bienId: '', locataireId: '', montant: '', dateEcheance: '', description: '', recurrente: false, frequenceRecurrence: '1' })
    setShowEcheanceModal(false)
  }

  const toggleEcheanceStatut = (id: string) => {
    setEcheances(echeances.map(echeance => {
      if (echeance.id === id) {
        const nouveauStatut = echeance.statut === 'paye' ? 'en_attente' : 'paye'
        const datePaiement = nouveauStatut === 'paye' ? new Date() : undefined
        
        // Si on marque comme payé, créer un paiement
        if (nouveauStatut === 'paye') {
          const nouveauPaiement: Paiement = {
            id: Date.now().toString(),
            echeanceId: id,
            locataireId: echeance.locataireId,
            bienId: echeance.bienId,
            montant: echeance.montant,
            datePaiement: new Date(),
            methodePaiement: 'virement',
            statut: 'confirme',
            createdAt: new Date()
          }
          setPaiements(prev => [...prev, nouveauPaiement])
        } else {
          // Si on annule le paiement, supprimer le paiement associé
          setPaiements(prev => prev.filter(p => p.echeanceId !== id))
        }
        
        return { ...echeance, statut: nouveauStatut, datePaiement }
      }
      return echeance
    }))
  }

  // Fonction pour ajouter un paiement
  const handleAddPaiement = () => {
    const nouveauPaiement: Paiement = {
      id: Date.now().toString(),
      echeanceId: paiementForm.echeanceId,
      locataireId: echeances.find(e => e.id === paiementForm.echeanceId)?.locataireId,
      bienId: echeances.find(e => e.id === paiementForm.echeanceId)?.bienId || '',
      montant: parseFloat(paiementForm.montant),
      datePaiement: new Date(paiementForm.datePaiement),
      methodePaiement: paiementForm.methodePaiement as 'virement' | 'cheque' | 'especes' | 'prelevement' | 'autre',
      referencePaiement: paiementForm.referencePaiement,
      statut: 'confirme',
      notes: paiementForm.notes,
      createdAt: new Date()
    }
    
    setPaiements([...paiements, nouveauPaiement])
    
    // Marquer l'échéance comme payée
    setEcheances(prev => prev.map(e => 
      e.id === paiementForm.echeanceId 
        ? { ...e, statut: 'paye', datePaiement: new Date(paiementForm.datePaiement) }
        : e
    ))
    
    setPaiementForm({ echeanceId: '', montant: '', datePaiement: '', methodePaiement: 'virement', referencePaiement: '', notes: '' })
    setShowPaiementModal(false)
  }

  // Fonction pour exporter les rapports
  const handleExportRapport = (format: 'csv' | 'pdf') => {
    if (user?.plan === 'gratuit') {
      alert('L\'export de rapports est réservé au plan premium.')
      return
    }
    
    // Simulation de l'export
    const data = {
      biens,
      locataires: locataires.filter(l => filtreLocataires === 'tous' || l.statut === filtreLocataires),
      echeances: echeances.filter(e => filtreEcheances === 'tous' || e.statut === filtreEcheances),
      paiements,
      periode: {
        debut: new Date(new Date().getFullYear(), 0, 1),
        fin: new Date()
      }
    }
    
    console.log(`Export ${format} généré:`, data)
    alert(`Rapport ${format.toUpperCase()} généré avec succès !`)
  }

  // Calculs pour le dashboard
  const locatairesActifs = locataires.filter(l => l.statut === 'actif')
  const echeancesEnAttente = echeances.filter(e => e.statut === 'en_attente')
  const echeancesEnRetard = echeances.filter(e => e.statut === 'en_retard' || (e.statut === 'en_attente' && new Date(e.dateEcheance) < new Date()))
  const echeancesPayees = echeances.filter(e => e.statut === 'paye')
  const revenuMensuel = locatairesActifs.reduce((total, locataire) => total + locataire.montantLoyer, 0)
  const revenuAnnuel = revenuMensuel * 12
  const paiementsCeMois = paiements.filter(p => {
    const maintenant = new Date()
    const paiementDate = new Date(p.datePaiement)
    return paiementDate.getMonth() === maintenant.getMonth() && paiementDate.getFullYear() === maintenant.getFullYear()
  }).reduce((total, p) => total + p.montant, 0)

  // Filtrer les données selon les filtres actifs
  const locatairesFiltres = locataires.filter(l => filtreLocataires === 'tous' || l.statut === filtreLocataires)
  const echeancesFiltrees = echeances.filter(e => filtreEcheances === 'tous' || e.statut === filtreEcheances)

  // Modal d'authentification
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold text-gray-900">Gestion Bailleurs</CardTitle>
            <CardDescription>Connectez-vous pour gérer vos biens locatifs</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="votre@email.com"
                value={authForm.email}
                onChange={(e) => setAuthForm({...authForm, email: e.target.value})}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={authForm.password}
                onChange={(e) => setAuthForm({...authForm, password: e.target.value})}
              />
            </div>
            <Button onClick={handleLogin} className="w-full bg-blue-600 hover:bg-blue-700">
              Se connecter
            </Button>
            <div className="text-center text-sm text-gray-600">
              <p>Démo : utilisez n'importe quel email/mot de passe</p>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <Home className="h-8 w-8 text-blue-600" />
              <h1 className="text-xl font-bold text-gray-900">Gestion Bailleurs</h1>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user?.plan === 'premium' ? 'default' : 'secondary'}>
                {user?.plan === 'premium' ? 'Premium' : 'Gratuit'}
              </Badge>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Déconnexion
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5 lg:w-auto lg:grid-cols-5">
            <TabsTrigger value="dashboard" className="flex items-center space-x-2">
              <Calendar className="h-4 w-4" />
              <span className="hidden sm:inline">Tableau de bord</span>
            </TabsTrigger>
            <TabsTrigger value="biens" className="flex items-center space-x-2">
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Biens</span>
            </TabsTrigger>
            <TabsTrigger value="locataires" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Locataires</span>
            </TabsTrigger>
            <TabsTrigger value="echeances" className="flex items-center space-x-2">
              <Clock className="h-4 w-4" />
              <span className="hidden sm:inline">Échéances</span>
            </TabsTrigger>
            <TabsTrigger value="financier" className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4" />
              <span className="hidden sm:inline">Financier</span>
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{revenuMensuel.toLocaleString()} €</div>
                  <p className="text-xs text-muted-foreground">
                    {revenuAnnuel.toLocaleString()} € / an
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paiements ce mois</CardTitle>
                  <DollarSign className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">{paiementsCeMois.toLocaleString()} €</div>
                  <p className="text-xs text-muted-foreground">
                    {paiements.filter(p => new Date(p.datePaiement).getMonth() === new Date().getMonth()).length} paiements
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">En retard</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">{echeancesEnRetard.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {echeancesEnRetard.reduce((total, e) => total + e.montant, 0).toLocaleString()} € impayés
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Biens gérés</CardTitle>
                  <Home className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{biens.length}</div>
                  <p className="text-xs text-muted-foreground">
                    {locatairesActifs.length} locataires actifs
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Statistiques détaillées */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Répartition des statuts</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Échéances payées</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full" 
                            style={{ width: `${(echeancesPayees.length / echeances.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{echeancesPayees.length}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">En attente</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-orange-500 h-2 rounded-full" 
                            style={{ width: `${(echeancesEnAttente.length / echeances.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{echeancesEnAttente.length}</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">En retard</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div 
                            className="bg-red-500 h-2 rounded-full" 
                            style={{ width: `${(echeancesEnRetard.length / echeances.length) * 100}%` }}
                          ></div>
                        </div>
                        <span className="text-sm font-medium">{echeancesEnRetard.length}</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <PieChart className="h-5 w-5" />
                    <span>Revenus par bien</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {biens.map(bien => {
                      const locatairesBien = locatairesActifs.filter(l => l.bienId === bien.id)
                      const revenuBien = locatairesBien.reduce((total, l) => total + l.montantLoyer, 0)
                      const pourcentage = revenuMensuel > 0 ? (revenuBien / revenuMensuel) * 100 : 0
                      
                      return (
                        <div key={bien.id} className="flex justify-between items-center">
                          <span className="text-sm truncate">{bien.nom}</span>
                          <div className="flex items-center space-x-2">
                            <div className="w-20 bg-gray-200 rounded-full h-2">
                              <div 
                                className="bg-blue-500 h-2 rounded-full" 
                                style={{ width: `${pourcentage}%` }}
                              ></div>
                            </div>
                            <span className="text-sm font-medium">{revenuBien} €</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Échéances urgentes */}
            <Card>
              <CardHeader>
                <CardTitle>Échéances urgentes</CardTitle>
                <CardDescription>Échéances à traiter dans les 7 prochains jours</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {echeances
                    .filter(e => {
                      const diff = new Date(e.dateEcheance).getTime() - new Date().getTime()
                      const jours = Math.ceil(diff / (1000 * 3600 * 24))
                      return jours <= 7 && jours >= 0 && e.statut !== 'paye'
                    })
                    .sort((a, b) => new Date(a.dateEcheance).getTime() - new Date(b.dateEcheance).getTime())
                    .slice(0, 5)
                    .map((echeance) => {
                      const bien = biens.find(b => b.id === echeance.bienId)
                      const locataire = echeance.locataireId ? locataires.find(l => l.id === echeance.locataireId) : null
                      const jours = Math.ceil((new Date(echeance.dateEcheance).getTime() - new Date().getTime()) / (1000 * 3600 * 24))
                      
                      return (
                        <div key={echeance.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${echeance.type === 'loyer' ? 'bg-green-100' : 'bg-orange-100'}`}>
                              {echeance.type === 'loyer' ? <CreditCard className="h-4 w-4 text-green-600" /> : <Settings className="h-4 w-4 text-orange-600" />}
                            </div>
                            <div>
                              <p className="font-medium">{echeance.description}</p>
                              <p className="text-sm text-gray-500">
                                {bien?.nom} {locataire && `- ${locataire.prenom} ${locataire.nom}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {jours === 0 ? 'Aujourd\'hui' : jours === 1 ? 'Demain' : `Dans ${jours} jours`}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold">{echeance.montant} €</span>
                            <Button
                              size="sm"
                              variant={echeance.statut === 'paye' ? 'default' : 'outline'}
                              onClick={() => toggleEcheanceStatut(echeance.id)}
                            >
                              {echeance.statut === 'paye' ? <CheckCircle className="h-4 w-4" /> : 'Marquer payé'}
                            </Button>
                          </div>
                        </div>
                      )
                    })}
                  {echeances.filter(e => {
                    const diff = new Date(e.dateEcheance).getTime() - new Date().getTime()
                    const jours = Math.ceil(diff / (1000 * 3600 * 24))
                    return jours <= 7 && jours >= 0 && e.statut !== 'paye'
                  }).length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucune échéance urgente</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gestion des biens */}
          <TabsContent value="biens" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes biens</h2>
              <Dialog open={showBienModal} onOpenChange={setShowBienModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un bien
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau bien</DialogTitle>
                    <DialogDescription>
                      Renseignez les informations de votre bien locatif
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4 max-h-96 overflow-y-auto">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="nom">Nom du bien</Label>
                        <Input
                          id="nom"
                          placeholder="Ex: Appartement Centre-ville"
                          value={bienForm.nom}
                          onChange={(e) => setBienForm({...bienForm, nom: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="type">Type de bien</Label>
                        <Select value={bienForm.type} onValueChange={(value) => setBienForm({...bienForm, type: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="appartement">Appartement</SelectItem>
                            <SelectItem value="maison">Maison</SelectItem>
                            <SelectItem value="studio">Studio</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="adresse">Adresse</Label>
                      <Textarea
                        id="adresse"
                        placeholder="Adresse complète"
                        value={bienForm.adresse}
                        onChange={(e) => setBienForm({...bienForm, adresse: e.target.value})}
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="montantLoyer">Montant du loyer (€)</Label>
                        <Input
                          id="montantLoyer"
                          type="number"
                          placeholder="1200"
                          value={bienForm.montantLoyer}
                          onChange={(e) => setBienForm({...bienForm, montantLoyer: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="surface">Surface (m²)</Label>
                        <Input
                          id="surface"
                          type="number"
                          placeholder="65"
                          value={bienForm.surface}
                          onChange={(e) => setBienForm({...bienForm, surface: e.target.value})}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="frequenceEntretien">Fréquence d'entretien (mois)</Label>
                      <Select value={bienForm.frequenceEntretien} onValueChange={(value) => setBienForm({...bienForm, frequenceEntretien: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="6">6 mois</SelectItem>
                          <SelectItem value="12">12 mois</SelectItem>
                          <SelectItem value="24">24 mois</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Photos du bien</Label>
                      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                        <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                        <p className="text-sm text-gray-500">Glissez vos photos ici ou cliquez pour sélectionner</p>
                        <p className="text-xs text-gray-400 mt-1">PNG, JPG jusqu'à 10MB</p>
                      </div>
                    </div>
                    <Button onClick={handleAddBien} className="w-full">
                      Ajouter le bien
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biens.map((bien) => {
                const locatairesBien = locataires.filter(l => l.bienId === bien.id && l.statut === 'actif')
                return (
                  <Card key={bien.id} className="overflow-hidden">
                    {bien.photos && bien.photos.length > 0 && (
                      <div className="h-48 overflow-hidden">
                        <img 
                          src={bien.photos[0]} 
                          alt={bien.nom}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {bien.nom}
                        <Badge variant="outline">{bien.type}</Badge>
                      </CardTitle>
                      <CardDescription>{bien.adresse}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Loyer mensuel</span>
                          <span className="font-bold">{bien.montantLoyer} €</span>
                        </div>
                        {bien.surface && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Surface</span>
                            <span className="text-sm">{bien.surface} m²</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Entretien</span>
                          <span className="text-sm">Tous les {bien.frequenceEntretien} mois</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Locataires</span>
                          <span className="text-sm">{locatairesBien.length}</span>
                        </div>
                        {bien.documents && bien.documents.length > 0 && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Documents</span>
                            <span className="text-sm">{bien.documents.length}</span>
                          </div>
                        )}
                      </div>
                      <Separator className="my-4" />
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="h-4 w-4 mr-1" />
                          Voir
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1">
                          <FileText className="h-4 w-4 mr-1" />
                          Docs
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Gestion des locataires */}
          <TabsContent value="locataires" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">Mes locataires</h2>
                <Select value={filtreLocataires} onValueChange={(value: any) => setFiltreLocataires(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Tous</SelectItem>
                    <SelectItem value="actif">Actifs</SelectItem>
                    <SelectItem value="ancien">Anciens</SelectItem>
                    <SelectItem value="archive">Archivés</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex space-x-2">
                <Dialog open={showArchiveModal} onOpenChange={setShowArchiveModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Archive className="h-4 w-4 mr-2" />
                      Archiver
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Archiver un locataire</DialogTitle>
                      <DialogDescription>
                        Archiver un locataire permet de conserver l'historique tout en le marquant comme inactif
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Locataire à archiver</Label>
                        <Select value={selectedLocataireArchive} onValueChange={setSelectedLocataireArchive}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un locataire" />
                          </SelectTrigger>
                          <SelectContent>
                            {locataires.filter(l => l.statut === 'actif').map((locataire) => (
                              <SelectItem key={locataire.id} value={locataire.id}>
                                {locataire.prenom} {locataire.nom}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Raison de l'archivage</Label>
                        <Textarea
                          placeholder="Ex: Fin de bail, déménagement..."
                          value={raisonArchivage}
                          onChange={(e) => setRaisonArchivage(e.target.value)}
                        />
                      </div>
                      <Button onClick={handleArchiveLocataire} className="w-full">
                        Archiver le locataire
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
                <Dialog open={showLocataireModal} onOpenChange={setShowLocataireModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Ajouter un locataire
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>Ajouter un nouveau locataire</DialogTitle>
                      <DialogDescription>
                        Renseignez les informations de votre locataire
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="nomLocataire">Nom</Label>
                          <Input
                            id="nomLocataire"
                            placeholder="Dupont"
                            value={locataireForm.nom}
                            onChange={(e) => setLocataireForm({...locataireForm, nom: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="prenomLocataire">Prénom</Label>
                          <Input
                            id="prenomLocataire"
                            placeholder="Marie"
                            value={locataireForm.prenom}
                            onChange={(e) => setLocataireForm({...locataireForm, prenom: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="emailLocataire">Email</Label>
                          <Input
                            id="emailLocataire"
                            type="email"
                            placeholder="marie.dupont@email.com"
                            value={locataireForm.email}
                            onChange={(e) => setLocataireForm({...locataireForm, email: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="telephoneLocataire">Téléphone</Label>
                          <Input
                            id="telephoneLocataire"
                            placeholder="06 12 34 56 78"
                            value={locataireForm.telephone}
                            onChange={(e) => setLocataireForm({...locataireForm, telephone: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="bienAssocie">Bien associé</Label>
                        <Select value={locataireForm.bienId} onValueChange={(value) => setLocataireForm({...locataireForm, bienId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un bien" />
                          </SelectTrigger>
                          <SelectContent>
                            {biens.map((bien) => (
                              <SelectItem key={bien.id} value={bien.id}>{bien.nom}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateEntree">Date d'entrée</Label>
                        <Input
                          id="dateEntree"
                          type="date"
                          value={locataireForm.dateEntree}
                          onChange={(e) => setLocataireForm({...locataireForm, dateEntree: e.target.value})}
                        />
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="montantLoyerLocataire">Loyer (€)</Label>
                          <Input
                            id="montantLoyerLocataire"
                            type="number"
                            placeholder="1200"
                            value={locataireForm.montantLoyer}
                            onChange={(e) => setLocataireForm({...locataireForm, montantLoyer: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="montantCharges">Charges (€)</Label>
                          <Input
                            id="montantCharges"
                            type="number"
                            placeholder="150"
                            value={locataireForm.montantCharges}
                            onChange={(e) => setLocataireForm({...locataireForm, montantCharges: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="depotGarantie">Dépôt (€)</Label>
                          <Input
                            id="depotGarantie"
                            type="number"
                            placeholder="2400"
                            value={locataireForm.montantDepotGarantie}
                            onChange={(e) => setLocataireForm({...locataireForm, montantDepotGarantie: e.target.value})}
                          />
                        </div>
                      </div>
                      <Button onClick={handleAddLocataire} className="w-full">
                        Ajouter le locataire
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locatairesFiltres.map((locataire) => {
                const bien = biens.find(b => b.id === locataire.bienId)
                return (
                  <Card key={locataire.id}>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center justify-between">
                        {locataire.prenom} {locataire.nom}
                        <Badge variant={
                          locataire.statut === 'actif' ? 'default' : 
                          locataire.statut === 'archive' ? 'secondary' : 'outline'
                        }>
                          {locataire.statut}
                        </Badge>
                      </CardTitle>
                      <CardDescription>{bien?.nom}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Email</span>
                          <span className="text-sm">{locataire.email}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Téléphone</span>
                          <span className="text-sm">{locataire.telephone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Loyer</span>
                          <span className="font-bold">{locataire.montantLoyer} €</span>
                        </div>
                        {locataire.montantCharges && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Charges</span>
                            <span className="text-sm">{locataire.montantCharges} €</span>
                          </div>
                        )}
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Entrée</span>
                          <span className="text-sm">{new Date(locataire.dateEntree).toLocaleDateString('fr-FR')}</span>
                        </div>
                        {locataire.dateSortie && (
                          <div className="flex justify-between">
                            <span className="text-sm text-gray-500">Sortie</span>
                            <span className="text-sm">{new Date(locataire.dateSortie).toLocaleDateString('fr-FR')}</span>
                          </div>
                        )}
                        {locataire.statut === 'archive' && locataire.raisonArchivage && (
                          <div className="mt-2 p-2 bg-gray-50 rounded text-xs">
                            <strong>Archivé :</strong> {locataire.raisonArchivage}
                          </div>
                        )}
                      </div>
                      {locataire.statut === 'archive' && (
                        <Separator className="my-4" />
                      )}
                      {locataire.statut === 'archive' && (
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          className="w-full"
                          onClick={() => handleDeleteLocataireData(locataire.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-2" />
                          Supprimer définitivement (RGPD)
                        </Button>
                      )}
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Gestion des échéances */}
          <TabsContent value="echeances" className="space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-bold">Échéances</h2>
                <Select value={filtreEcheances} onValueChange={(value: any) => setFiltreEcheances(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tous">Toutes</SelectItem>
                    <SelectItem value="en_attente">En attente</SelectItem>
                    <SelectItem value="paye">Payées</SelectItem>
                    <SelectItem value="en_retard">En retard</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Dialog open={showEcheanceModal} onOpenChange={setShowEcheanceModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter une échéance
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter une nouvelle échéance</DialogTitle>
                    <DialogDescription>
                      Créez une échéance de maintenance ou autre
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="typeEcheance">Type</Label>
                      <Select value={echeanceForm.type} onValueChange={(value) => setEcheanceForm({...echeanceForm, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="maintenance">Maintenance</SelectItem>
                          <SelectItem value="charges">Charges</SelectItem>
                          <SelectItem value="autre">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="bienEcheance">Bien concerné</Label>
                      <Select value={echeanceForm.bienId} onValueChange={(value) => setEcheanceForm({...echeanceForm, bienId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un bien" />
                        </SelectTrigger>
                        <SelectContent>
                          {biens.map((bien) => (
                            <SelectItem key={bien.id} value={bien.id}>{bien.nom}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="locataireEcheance">Locataire (optionnel)</Label>
                      <Select value={echeanceForm.locataireId} onValueChange={(value) => setEcheanceForm({...echeanceForm, locataireId: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionner un locataire" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="">Aucun locataire</SelectItem>
                          {locataires.filter(l => l.statut === 'actif').map((locataire) => (
                            <SelectItem key={locataire.id} value={locataire.id}>
                              {locataire.prenom} {locataire.nom}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="montantEcheance">Montant (€)</Label>
                      <Input
                        id="montantEcheance"
                        type="number"
                        placeholder="150"
                        value={echeanceForm.montant}
                        onChange={(e) => setEcheanceForm({...echeanceForm, montant: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="dateEcheanceForm">Date d'échéance</Label>
                      <Input
                        id="dateEcheanceForm"
                        type="date"
                        value={echeanceForm.dateEcheance}
                        onChange={(e) => setEcheanceForm({...echeanceForm, dateEcheance: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="descriptionEcheance">Description</Label>
                      <Textarea
                        id="descriptionEcheance"
                        placeholder="Ex: Révision chaudière"
                        value={echeanceForm.description}
                        onChange={(e) => setEcheanceForm({...echeanceForm, description: e.target.value})}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox 
                        id="recurrente"
                        checked={echeanceForm.recurrente}
                        onCheckedChange={(checked) => setEcheanceForm({...echeanceForm, recurrente: checked as boolean})}
                      />
                      <Label htmlFor="recurrente">Échéance récurrente</Label>
                    </div>
                    {echeanceForm.recurrente && (
                      <div className="space-y-2">
                        <Label htmlFor="frequenceRecurrence">Fréquence (mois)</Label>
                        <Select value={echeanceForm.frequenceRecurrence} onValueChange={(value) => setEcheanceForm({...echeanceForm, frequenceRecurrence: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">Mensuelle</SelectItem>
                            <SelectItem value="3">Trimestrielle</SelectItem>
                            <SelectItem value="6">Semestrielle</SelectItem>
                            <SelectItem value="12">Annuelle</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                    <Button onClick={handleAddEcheance} className="w-full">
                      Ajouter l'échéance
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {echeancesFiltrees
                .sort((a, b) => new Date(b.dateEcheance).getTime() - new Date(a.dateEcheance).getTime())
                .map((echeance) => {
                const bien = biens.find(b => b.id === echeance.bienId)
                const locataire = echeance.locataireId ? locataires.find(l => l.id === echeance.locataireId) : null
                const paiement = paiements.find(p => p.echeanceId === echeance.id)
                const isEnRetard = echeance.statut === 'en_attente' && new Date(echeance.dateEcheance) < new Date()
                
                return (
                  <Card key={echeance.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${
                            echeance.type === 'loyer' ? 'bg-green-100' : 
                            echeance.type === 'maintenance' ? 'bg-orange-100' : 
                            'bg-blue-100'
                          }`}>
                            {echeance.type === 'loyer' ? <CreditCard className="h-5 w-5 text-green-600" /> : 
                             echeance.type === 'maintenance' ? <Settings className="h-5 w-5 text-orange-600" /> :
                             <FileText className="h-5 w-5 text-blue-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{echeance.description}</h3>
                            <p className="text-sm text-gray-500">
                              {bien?.nom} {locataire && `- ${locataire.prenom} ${locataire.nom}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Échéance : {new Date(echeance.dateEcheance).toLocaleDateString('fr-FR')}
                            </p>
                            {paiement && (
                              <p className="text-sm text-green-600">
                                Payé le {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')} 
                                {paiement.methodePaiement && ` par ${paiement.methodePaiement}`}
                              </p>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={
                            echeance.statut === 'paye' ? 'default' : 
                            isEnRetard ? 'destructive' : 'secondary'
                          }>
                            {echeance.statut === 'paye' ? 'Payé' : 
                             isEnRetard ? 'En retard' : 'En attente'}
                          </Badge>
                          <span className="font-bold text-lg">{echeance.montant} €</span>
                          <Button
                            size="sm"
                            variant={echeance.statut === 'paye' ? 'outline' : 'default'}
                            onClick={() => toggleEcheanceStatut(echeance.id)}
                          >
                            {echeance.statut === 'paye' ? 'Annuler' : 'Marquer payé'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Suivi financier */}
          <TabsContent value="financier" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Suivi financier</h2>
              <div className="flex space-x-2">
                <Dialog open={showRapportModal} onOpenChange={setShowRapportModal}>
                  <DialogTrigger asChild>
                    <Button variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Exporter
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Exporter les rapports financiers</DialogTitle>
                      <DialogDescription>
                        {user?.plan === 'gratuit' 
                          ? 'L\'export de rapports est réservé au plan premium.'
                          : 'Choisissez le format d\'export de vos données financières'
                        }
                      </DialogDescription>
                    </DialogHeader>
                    {user?.plan === 'premium' ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <Button onClick={() => handleExportRapport('csv')} className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Export CSV
                          </Button>
                          <Button onClick={() => handleExportRapport('pdf')} className="w-full">
                            <FileText className="h-4 w-4 mr-2" />
                            Export PDF
                          </Button>
                        </div>
                        <p className="text-sm text-gray-500">
                          L'export inclura tous les biens, locataires, échéances et paiements de l'année en cours.
                        </p>
                      </div>
                    ) : (
                      <div className="text-center py-4">
                        <p className="text-gray-500 mb-4">Passez au plan premium pour accéder à l'export de rapports.</p>
                        <Button>Passer au premium</Button>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
                <Dialog open={showPaiementModal} onOpenChange={setShowPaiementModal}>
                  <DialogTrigger asChild>
                    <Button>
                      <Plus className="h-4 w-4 mr-2" />
                      Enregistrer un paiement
                    </Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>Enregistrer un paiement</DialogTitle>
                      <DialogDescription>
                        Enregistrez un paiement reçu pour une échéance
                      </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>Échéance concernée</Label>
                        <Select value={paiementForm.echeanceId} onValueChange={(value) => setPaiementForm({...paiementForm, echeanceId: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner une échéance" />
                          </SelectTrigger>
                          <SelectContent>
                            {echeances.filter(e => e.statut !== 'paye').map((echeance) => {
                              const bien = biens.find(b => b.id === echeance.bienId)
                              const locataire = echeance.locataireId ? locataires.find(l => l.id === echeance.locataireId) : null
                              return (
                                <SelectItem key={echeance.id} value={echeance.id}>
                                  {echeance.description} - {bien?.nom} {locataire && `(${locataire.prenom} ${locataire.nom})`} - {echeance.montant}€
                                </SelectItem>
                              )
                            })}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Montant (€)</Label>
                          <Input
                            type="number"
                            placeholder="1200"
                            value={paiementForm.montant}
                            onChange={(e) => setPaiementForm({...paiementForm, montant: e.target.value})}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label>Date de paiement</Label>
                          <Input
                            type="date"
                            value={paiementForm.datePaiement}
                            onChange={(e) => setPaiementForm({...paiementForm, datePaiement: e.target.value})}
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label>Méthode de paiement</Label>
                        <Select value={paiementForm.methodePaiement} onValueChange={(value) => setPaiementForm({...paiementForm, methodePaiement: value})}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="virement">Virement</SelectItem>
                            <SelectItem value="cheque">Chèque</SelectItem>
                            <SelectItem value="especes">Espèces</SelectItem>
                            <SelectItem value="prelevement">Prélèvement</SelectItem>
                            <SelectItem value="autre">Autre</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Référence (optionnel)</Label>
                        <Input
                          placeholder="N° chèque, référence virement..."
                          value={paiementForm.referencePaiement}
                          onChange={(e) => setPaiementForm({...paiementForm, referencePaiement: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Notes (optionnel)</Label>
                        <Textarea
                          placeholder="Commentaires sur ce paiement..."
                          value={paiementForm.notes}
                          onChange={(e) => setPaiementForm({...paiementForm, notes: e.target.value})}
                        />
                      </div>
                      <Button onClick={handleAddPaiement} className="w-full">
                        Enregistrer le paiement
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* Statistiques financières détaillées */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus annuels</CardTitle>
                  <TrendingUp className="h-4 w-4 text-green-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-green-600">{revenuAnnuel.toLocaleString()} €</div>
                  <p className="text-xs text-muted-foreground">
                    {revenuMensuel.toLocaleString()} € / mois
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Paiements reçus</CardTitle>
                  <CheckCircle className="h-4 w-4 text-blue-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-blue-600">
                    {paiements.reduce((total, p) => total + p.montant, 0).toLocaleString()} €
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {paiements.length} paiements
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Impayés</CardTitle>
                  <AlertCircle className="h-4 w-4 text-red-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-red-500">
                    {echeancesEnRetard.reduce((total, e) => total + e.montant, 0).toLocaleString()} €
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {echeancesEnRetard.length} échéances
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Taux de recouvrement</CardTitle>
                  <PieChart className="h-4 w-4 text-purple-600" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold text-purple-600">
                    {echeances.length > 0 ? Math.round((echeancesPayees.length / echeances.length) * 100) : 0}%
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {echeancesPayees.length} / {echeances.length} payées
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Historique des paiements */}
            <Card>
              <CardHeader>
                <CardTitle>Historique des paiements</CardTitle>
                <CardDescription>Tous les paiements reçus</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {paiements
                    .sort((a, b) => new Date(b.datePaiement).getTime() - new Date(a.datePaiement).getTime())
                    .slice(0, 10)
                    .map((paiement) => {
                      const echeance = echeances.find(e => e.id === paiement.echeanceId)
                      const bien = biens.find(b => b.id === paiement.bienId)
                      const locataire = paiement.locataireId ? locataires.find(l => l.id === paiement.locataireId) : null
                      
                      return (
                        <div key={paiement.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className="p-2 rounded-full bg-green-100">
                              <CheckCircle className="h-4 w-4 text-green-600" />
                            </div>
                            <div>
                              <p className="font-medium">{echeance?.description}</p>
                              <p className="text-sm text-gray-500">
                                {bien?.nom} {locataire && `- ${locataire.prenom} ${locataire.nom}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(paiement.datePaiement).toLocaleDateString('fr-FR')}
                                {paiement.methodePaiement && ` • ${paiement.methodePaiement}`}
                                {paiement.referencePaiement && ` • ${paiement.referencePaiement}`}
                              </p>
                              {paiement.notes && (
                                <p className="text-xs text-gray-400 mt-1">{paiement.notes}</p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="font-bold text-green-600">+{paiement.montant} €</span>
                            <Badge variant="outline" className="ml-2">
                              {paiement.statut}
                            </Badge>
                          </div>
                        </div>
                      )
                    })}
                  {paiements.length === 0 && (
                    <p className="text-gray-500 text-center py-4">Aucun paiement enregistré</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}