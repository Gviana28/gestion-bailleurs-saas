'use client'

import { useState, useEffect } from 'react'
import { Calendar, Home, Users, Clock, Plus, Settings, CreditCard, Bell, CheckCircle, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'

// Types
interface Bien {
  id: string
  nom: string
  adresse: string
  montantLoyer: number
  frequenceEntretien: number // en mois
  createdAt: Date
}

interface Locataire {
  id: string
  nom: string
  email: string
  telephone: string
  bienId: string
  dateEntree: Date
  montantLoyer: number
  createdAt: Date
}

interface Echeance {
  id: string
  type: 'loyer' | 'maintenance'
  locataireId?: string
  bienId: string
  montant: number
  dateEcheance: Date
  statut: 'en_attente' | 'payee' | 'en_retard'
  description: string
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
  const [activeTab, setActiveTab] = useState('dashboard')

  // États pour les modales
  const [showBienModal, setShowBienModal] = useState(false)
  const [showLocataireModal, setShowLocataireModal] = useState(false)
  const [showEcheanceModal, setShowEcheanceModal] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(true)

  // États pour les formulaires
  const [authForm, setAuthForm] = useState({ email: '', password: '' })
  const [bienForm, setBienForm] = useState({ nom: '', adresse: '', montantLoyer: '', frequenceEntretien: '12' })
  const [locataireForm, setLocataireForm] = useState({ nom: '', email: '', telephone: '', bienId: '', dateEntree: '', montantLoyer: '' })
  const [echeanceForm, setEcheanceForm] = useState({ type: 'maintenance', bienId: '', montant: '', dateEcheance: '', description: '' })

  // Données de démonstration
  useEffect(() => {
    if (isAuthenticated) {
      // Simulation de données
      const demoUser: User = {
        id: '1',
        email: 'demo@example.com',
        plan: 'gratuit',
        dateInscription: new Date()
      }
      
      const demoBiens: Bien[] = [
        {
          id: '1',
          nom: 'Appartement Centre-ville',
          adresse: '15 rue de la République, 75001 Paris',
          montantLoyer: 1200,
          frequenceEntretien: 12,
          createdAt: new Date()
        }
      ]
      
      const demoLocataires: Locataire[] = [
        {
          id: '1',
          nom: 'Marie Dupont',
          email: 'marie.dupont@email.com',
          telephone: '06 12 34 56 78',
          bienId: '1',
          dateEntree: new Date('2024-01-01'),
          montantLoyer: 1200,
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
          statut: 'en_attente',
          description: 'Loyer décembre 2024',
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
          createdAt: new Date()
        }
      ]
      
      setUser(demoUser)
      setBiens(demoBiens)
      setLocataires(demoLocataires)
      setEcheances(demoEcheances)
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
      createdAt: new Date()
    }
    
    setBiens([...biens, nouveauBien])
    setBienForm({ nom: '', adresse: '', montantLoyer: '', frequenceEntretien: '12' })
    setShowBienModal(false)
  }

  // Fonctions CRUD pour les locataires
  const handleAddLocataire = () => {
    if (user?.plan === 'gratuit' && locataires.length >= 2) {
      alert('Plan gratuit limité à 2 locataires. Passez au plan premium pour plus de locataires.')
      return
    }
    
    const nouveauLocataire: Locataire = {
      id: Date.now().toString(),
      nom: locataireForm.nom,
      email: locataireForm.email,
      telephone: locataireForm.telephone,
      bienId: locataireForm.bienId,
      dateEntree: new Date(locataireForm.dateEntree),
      montantLoyer: parseFloat(locataireForm.montantLoyer),
      createdAt: new Date()
    }
    
    setLocataires([...locataires, nouveauLocataire])
    setLocataireForm({ nom: '', email: '', telephone: '', bienId: '', dateEntree: '', montantLoyer: '' })
    setShowLocataireModal(false)
  }

  // Fonctions pour les échéances
  const handleAddEcheance = () => {
    const nouvelleEcheance: Echeance = {
      id: Date.now().toString(),
      type: echeanceForm.type as 'loyer' | 'maintenance',
      bienId: echeanceForm.bienId,
      montant: parseFloat(echeanceForm.montant),
      dateEcheance: new Date(echeanceForm.dateEcheance),
      statut: 'en_attente',
      description: echeanceForm.description,
      createdAt: new Date()
    }
    
    setEcheances([...echeances, nouvelleEcheance])
    setEcheanceForm({ type: 'maintenance', bienId: '', montant: '', dateEcheance: '', description: '' })
    setShowEcheanceModal(false)
  }

  const toggleEcheanceStatut = (id: string) => {
    setEcheances(echeances.map(echeance => 
      echeance.id === id 
        ? { ...echeance, statut: echeance.statut === 'payee' ? 'en_attente' : 'payee' }
        : echeance
    ))
  }

  // Calculs pour le dashboard
  const echeancesEnAttente = echeances.filter(e => e.statut === 'en_attente')
  const revenuMensuel = locataires.reduce((total, locataire) => total + locataire.montantLoyer, 0)
  const echeancesCeMois = echeances.filter(e => {
    const maintenant = new Date()
    const echeanceDate = new Date(e.dateEcheance)
    return echeanceDate.getMonth() === maintenant.getMonth() && echeanceDate.getFullYear() === maintenant.getFullYear()
  })

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
          <TabsList className="grid w-full grid-cols-4 lg:w-auto lg:grid-cols-4">
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
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus mensuels</CardTitle>
                  <CreditCard className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{revenuMensuel.toLocaleString()} €</div>
                  <p className="text-xs text-muted-foreground">
                    {locataires.length} locataire{locataires.length > 1 ? 's' : ''}
                  </p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Échéances en attente</CardTitle>
                  <AlertCircle className="h-4 w-4 text-orange-500" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{echeancesEnAttente.length}</div>
                  <p className="text-xs text-muted-foreground">
                    À traiter ce mois
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
                    {user?.plan === 'gratuit' ? 'Max 1 (gratuit)' : 'Max 10 (premium)'}
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Échéances du mois */}
            <Card>
              <CardHeader>
                <CardTitle>Échéances de ce mois</CardTitle>
                <CardDescription>Loyers et maintenances à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {echeancesCeMois.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">Aucune échéance ce mois</p>
                  ) : (
                    echeancesCeMois.map((echeance) => {
                      const bien = biens.find(b => b.id === echeance.bienId)
                      const locataire = echeance.locataireId ? locataires.find(l => l.id === echeance.locataireId) : null
                      
                      return (
                        <div key={echeance.id} className="flex items-center justify-between p-4 border rounded-lg">
                          <div className="flex items-center space-x-4">
                            <div className={`p-2 rounded-full ${echeance.type === 'loyer' ? 'bg-green-100' : 'bg-orange-100'}`}>
                              {echeance.type === 'loyer' ? <CreditCard className="h-4 w-4 text-green-600" /> : <Settings className="h-4 w-4 text-orange-600" />}
                            </div>
                            <div>
                              <p className="font-medium">{echeance.description}</p>
                              <p className="text-sm text-gray-500">
                                {bien?.nom} {locataire && `- ${locataire.nom}`}
                              </p>
                              <p className="text-sm text-gray-500">
                                {new Date(echeance.dateEcheance).toLocaleDateString('fr-FR')}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-4">
                            <span className="font-bold">{echeance.montant} €</span>
                            <Button
                              size="sm"
                              variant={echeance.statut === 'payee' ? 'default' : 'outline'}
                              onClick={() => toggleEcheanceStatut(echeance.id)}
                            >
                              {echeance.statut === 'payee' ? <CheckCircle className="h-4 w-4" /> : 'Marquer payé'}
                            </Button>
                          </div>
                        </div>
                      )
                    })
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
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau bien</DialogTitle>
                    <DialogDescription>
                      Renseignez les informations de votre bien locatif
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
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
                      <Label htmlFor="adresse">Adresse</Label>
                      <Textarea
                        id="adresse"
                        placeholder="Adresse complète"
                        value={bienForm.adresse}
                        onChange={(e) => setBienForm({...bienForm, adresse: e.target.value})}
                      />
                    </div>
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
                    <Button onClick={handleAddBien} className="w-full">
                      Ajouter le bien
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {biens.map((bien) => (
                <Card key={bien.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{bien.nom}</CardTitle>
                    <CardDescription>{bien.adresse}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Loyer mensuel</span>
                        <span className="font-bold">{bien.montantLoyer} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Entretien</span>
                        <span className="text-sm">Tous les {bien.frequenceEntretien} mois</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Locataires</span>
                        <span className="text-sm">{locataires.filter(l => l.bienId === bien.id).length}</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Gestion des locataires */}
          <TabsContent value="locataires" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Mes locataires</h2>
              <Dialog open={showLocataireModal} onOpenChange={setShowLocataireModal}>
                <DialogTrigger asChild>
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter un locataire
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Ajouter un nouveau locataire</DialogTitle>
                    <DialogDescription>
                      Renseignez les informations de votre locataire
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="nomLocataire">Nom complet</Label>
                      <Input
                        id="nomLocataire"
                        placeholder="Ex: Marie Dupont"
                        value={locataireForm.nom}
                        onChange={(e) => setLocataireForm({...locataireForm, nom: e.target.value})}
                      />
                    </div>
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
                    <div className="space-y-2">
                      <Label htmlFor="montantLoyerLocataire">Montant du loyer (€)</Label>
                      <Input
                        id="montantLoyerLocataire"
                        type="number"
                        placeholder="1200"
                        value={locataireForm.montantLoyer}
                        onChange={(e) => setLocataireForm({...locataireForm, montantLoyer: e.target.value})}
                      />
                    </div>
                    <Button onClick={handleAddLocataire} className="w-full">
                      Ajouter le locataire
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {locataires.map((locataire) => {
                const bien = biens.find(b => b.id === locataire.bienId)
                return (
                  <Card key={locataire.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{locataire.nom}</CardTitle>
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
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Entrée</span>
                          <span className="text-sm">{new Date(locataire.dateEntree).toLocaleDateString('fr-FR')}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>

          {/* Gestion des échéances */}
          <TabsContent value="echeances" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Échéances</h2>
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
                          <SelectItem value="loyer">Loyer</SelectItem>
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
                    <Button onClick={handleAddEcheance} className="w-full">
                      Ajouter l'échéance
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="space-y-4">
              {echeances.map((echeance) => {
                const bien = biens.find(b => b.id === echeance.bienId)
                const locataire = echeance.locataireId ? locataires.find(l => l.id === echeance.locataireId) : null
                
                return (
                  <Card key={echeance.id}>
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4">
                          <div className={`p-3 rounded-full ${echeance.type === 'loyer' ? 'bg-green-100' : 'bg-orange-100'}`}>
                            {echeance.type === 'loyer' ? <CreditCard className="h-5 w-5 text-green-600" /> : <Settings className="h-5 w-5 text-orange-600" />}
                          </div>
                          <div>
                            <h3 className="font-semibold">{echeance.description}</h3>
                            <p className="text-sm text-gray-500">
                              {bien?.nom} {locataire && `- ${locataire.nom}`}
                            </p>
                            <p className="text-sm text-gray-500">
                              Échéance : {new Date(echeance.dateEcheance).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <Badge variant={echeance.statut === 'payee' ? 'default' : 'secondary'}>
                            {echeance.statut === 'payee' ? 'Payé' : 'En attente'}
                          </Badge>
                          <span className="font-bold text-lg">{echeance.montant} €</span>
                          <Button
                            size="sm"
                            variant={echeance.statut === 'payee' ? 'outline' : 'default'}
                            onClick={() => toggleEcheanceStatut(echeance.id)}
                          >
                            {echeance.statut === 'payee' ? 'Annuler' : 'Marquer payé'}
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}