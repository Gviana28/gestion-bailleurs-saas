// Types pour l'application Gestion Bailleurs

export interface User {
  id: string
  email: string
  plan: 'gratuit' | 'premium'
  dateInscription: Date
  stripeCustomerId?: string
  stripeSubscriptionId?: string
}

export interface Bien {
  id: string
  userId: string
  nom: string
  adresse: string
  montantLoyer: number
  frequenceEntretien: number // en mois
  dateAchat?: Date
  surface?: number
  type?: 'appartement' | 'maison' | 'studio' | 'autre'
  // Nouveaux champs pour photos et documents
  photos?: string[] // URLs des photos
  documents?: Document[] // Documents (contrat, état des lieux, etc.)
  createdAt: Date
  updatedAt: Date
}

export interface Document {
  id: string
  nom: string
  type: 'contrat_bail' | 'etat_lieux_entree' | 'etat_lieux_sortie' | 'assurance' | 'autre'
  url: string
  dateUpload: Date
}

export interface Locataire {
  id: string
  userId: string
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
  statut: 'actif' | 'ancien' | 'archive' // Ajout du statut archive
  // Nouveaux champs pour l'archivage
  dateArchivage?: Date
  raisonArchivage?: string
  createdAt: Date
  updatedAt: Date
}

export interface Echeance {
  id: string
  userId: string
  type: 'loyer' | 'maintenance' | 'charges' | 'autre'
  locataireId?: string
  bienId: string
  montant: number
  dateEcheance: Date
  datePaiement?: Date
  statut: 'en_attente' | 'paye' | 'en_retard' | 'annule' // Correction orthographe
  description: string
  recurrente: boolean
  frequenceRecurrence?: number // en mois
  prochaineDateEcheance?: Date
  createdAt: Date
  updatedAt: Date
}

// Nouvelle interface pour les paiements
export interface Paiement {
  id: string
  userId: string
  echeanceId: string
  locataireId?: string
  bienId: string
  montant: number
  datePaiement: Date
  methodePaiement?: 'virement' | 'cheque' | 'especes' | 'prelevement' | 'autre'
  referencePaiement?: string // numéro de chèque, référence virement, etc.
  statut: 'en_attente' | 'confirme' | 'rejete' | 'rembourse'
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Notification {
  id: string
  userId: string
  type: 'rappel_loyer' | 'maintenance_due' | 'paiement_recu' | 'autre'
  titre: string
  message: string
  destinataire: string // email
  dateEnvoi?: Date
  statut: 'en_attente' | 'envoye' | 'echec'
  echeanceId?: string
  createdAt: Date
}

export interface PlanLimites {
  gratuit: {
    maxBiens: 1
    maxLocataires: 2
    notificationsAutomatiques: false
    supportPrioritaire: false
    exportRapports: false
  }
  premium: {
    maxBiens: 10
    maxLocataires: 50
    notificationsAutomatiques: true
    supportPrioritaire: true
    exportRapports: true
    prix: 10 // euros par mois
  }
}

// Types pour les formulaires
export interface BienFormData {
  nom: string
  adresse: string
  montantLoyer: string
  frequenceEntretien: string
  surface?: string
  type?: string
  photos?: File[]
  documents?: File[]
}

export interface LocataireFormData {
  nom: string
  prenom?: string
  email: string
  telephone: string
  bienId: string
  dateEntree: string
  montantLoyer: string
  montantCharges?: string
  montantDepotGarantie?: string
}

export interface EcheanceFormData {
  type: string
  bienId: string
  locataireId?: string
  montant: string
  dateEcheance: string
  description: string
  recurrente: boolean
  frequenceRecurrence?: string
}

export interface PaiementFormData {
  echeanceId: string
  montant: string
  datePaiement: string
  methodePaiement?: string
  referencePaiement?: string
  notes?: string
}

export interface AuthFormData {
  email: string
  password: string
  confirmPassword?: string
}

// Types pour les statistiques avec suivi financier
export interface StatistiquesDashboard {
  revenuMensuel: number
  revenuAnnuel: number
  nombreBiens: number
  nombreLocataires: number
  echeancesEnAttente: number
  echeancesEnRetard: number
  echeancesPayees: number
  paiementsCeMois: number
  tauxOccupation: number
  prochainePaiement?: Date
  tauxRecouvrement: number // pourcentage de loyers payés à temps
}

// Types pour les filtres et recherches
export interface FiltresEcheances {
  statut?: 'en_attente' | 'paye' | 'en_retard' | 'annule'
  type?: 'loyer' | 'maintenance' | 'charges' | 'autre'
  bienId?: string
  locataireId?: string
  dateDebut?: Date
  dateFin?: Date
}

export interface FiltresLocataires {
  statut?: 'actif' | 'ancien' | 'archive'
  bienId?: string
  recherche?: string
}

export interface FiltresPaiements {
  statut?: 'en_attente' | 'confirme' | 'rejete' | 'rembourse'
  methodePaiement?: 'virement' | 'cheque' | 'especes' | 'prelevement' | 'autre'
  bienId?: string
  locataireId?: string
  dateDebut?: Date
  dateFin?: Date
}

// Types pour l'intégration Stripe
export interface StripeSubscription {
  id: string
  status: 'active' | 'canceled' | 'past_due' | 'unpaid'
  currentPeriodEnd: Date
  cancelAtPeriodEnd: boolean
  plan: 'premium'
}

// Types pour les emails
export interface EmailTemplate {
  type: 'rappel_loyer' | 'maintenance_due' | 'bienvenue'
  sujet: string
  contenu: string
  variables: string[] // variables disponibles comme {nom_locataire}, {montant_loyer}, etc.
}

// Types pour l'export de données (nouveau)
export interface ExportData {
  biens: Bien[]
  locataires: Locataire[]
  echeances: Echeance[]
  paiements: Paiement[]
  periode: {
    debut: Date
    fin: Date
  }
  format: 'csv' | 'pdf' | 'excel'
}

// Types pour les rapports financiers (nouveau)
export interface RapportFinancier {
  userId: string
  bienNom: string
  locataireNom?: string
  typeEcheance: string
  montantEcheance: number
  dateEcheance: Date
  statutEcheance: string
  montantPaye?: number
  datePaiement?: Date
  methodePaiement?: string
  statutPaiement?: string
  annee: number
  mois: number
}

// Types pour les analyses financières (nouveau)
export interface AnalyseFinanciere {
  periode: {
    debut: Date
    fin: Date
  }
  revenus: {
    total: number
    parMois: { [mois: string]: number }
    parBien: { [bienId: string]: number }
  }
  depenses: {
    total: number
    parType: { [type: string]: number }
    parBien: { [bienId: string]: number }
  }
  rentabilite: {
    brute: number
    nette: number
    parBien: { [bienId: string]: number }
  }
  impayés: {
    total: number
    nombre: number
    parLocataire: { [locataireId: string]: number }
  }
}

// Types pour la conformité RGPD (nouveau)
export interface DonneesPersonnelles {
  locataireId: string
  donnees: {
    identite: boolean
    contact: boolean
    financier: boolean
    documents: boolean
  }
  dateCollecte: Date
  consentement: boolean
  dateConsentement?: Date
  droitEffacement: boolean
  dateEffacement?: Date
}

// Types pour les notifications automatiques (nouveau)
export interface ConfigurationNotification {
  userId: string
  type: 'rappel_loyer' | 'maintenance_due' | 'paiement_recu'
  active: boolean
  delaiRappel: number // en jours
  template: string
  destinataires: string[] // emails
}

// Types pour l'upload de fichiers (nouveau)
export interface FileUpload {
  file: File
  type: 'photo' | 'document'
  category?: 'contrat_bail' | 'etat_lieux_entree' | 'etat_lieux_sortie' | 'assurance' | 'autre'
  bienId?: string
  locataireId?: string
}