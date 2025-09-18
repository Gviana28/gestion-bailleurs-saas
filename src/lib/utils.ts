import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utilitaires pour les dates
export const dateUtils = {
  formatDate: (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR')
  },

  formatDateTime: (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR') + ' à ' + d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })
  },

  isOverdue: (date: Date | string) => {
    const d = new Date(date)
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    return d < today
  },

  isDueThisMonth: (date: Date | string) => {
    const d = new Date(date)
    const today = new Date()
    return d.getMonth() === today.getMonth() && d.getFullYear() === today.getFullYear()
  },

  addMonths: (date: Date, months: number) => {
    const result = new Date(date)
    result.setMonth(result.getMonth() + months)
    return result
  },

  getMonthName: (date: Date | string) => {
    const d = new Date(date)
    return d.toLocaleDateString('fr-FR', { month: 'long', year: 'numeric' })
  }
}

// Utilitaires pour les montants
export const moneyUtils = {
  formatCurrency: (amount: number) => {
    return new Intl.NumberFormat('fr-FR', {
      style: 'currency',
      currency: 'EUR'
    }).format(amount)
  },

  parseCurrency: (value: string) => {
    return parseFloat(value.replace(/[^\d.-]/g, '')) || 0
  }
}

// Utilitaires pour la validation
export const validationUtils = {
  isValidEmail: (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  },

  isValidPhone: (phone: string) => {
    const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/
    return phoneRegex.test(phone.replace(/\s/g, ''))
  },

  isValidAmount: (amount: string) => {
    const num = parseFloat(amount)
    return !isNaN(num) && num > 0
  }
}

// Utilitaires pour les plans et limites
export const planUtils = {
  getLimits: (plan: 'gratuit' | 'premium') => {
    const limits = {
      gratuit: {
        maxBiens: 1,
        maxLocataires: 2,
        notificationsAutomatiques: false,
        supportPrioritaire: false
      },
      premium: {
        maxBiens: 10,
        maxLocataires: 50,
        notificationsAutomatiques: true,
        supportPrioritaire: true
      }
    }
    return limits[plan]
  },

  canAddBien: (currentCount: number, plan: 'gratuit' | 'premium') => {
    const limits = planUtils.getLimits(plan)
    return currentCount < limits.maxBiens
  },

  canAddLocataire: (currentCount: number, plan: 'gratuit' | 'premium') => {
    const limits = planUtils.getLimits(plan)
    return currentCount < limits.maxLocataires
  },

  getPlanBadgeVariant: (plan: 'gratuit' | 'premium') => {
    return plan === 'premium' ? 'default' : 'secondary'
  }
}

// Utilitaires pour les statuts
export const statusUtils = {
  getEcheanceStatusColor: (statut: string) => {
    const colors = {
      'en_attente': 'text-orange-600 bg-orange-100',
      'payee': 'text-green-600 bg-green-100',
      'en_retard': 'text-red-600 bg-red-100',
      'annulee': 'text-gray-600 bg-gray-100'
    }
    return colors[statut as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  },

  getEcheanceStatusLabel: (statut: string) => {
    const labels = {
      'en_attente': 'En attente',
      'payee': 'Payé',
      'en_retard': 'En retard',
      'annulee': 'Annulé'
    }
    return labels[statut as keyof typeof labels] || statut
  },

  getLocataireStatusColor: (statut: string) => {
    const colors = {
      'actif': 'text-green-600 bg-green-100',
      'ancien': 'text-gray-600 bg-gray-100'
    }
    return colors[statut as keyof typeof colors] || 'text-gray-600 bg-gray-100'
  },

  getTypeEcheanceIcon: (type: string) => {
    const icons = {
      'loyer': 'CreditCard',
      'maintenance': 'Settings',
      'charges': 'Receipt',
      'autre': 'FileText'
    }
    return icons[type as keyof typeof icons] || 'FileText'
  }
}

// Utilitaires pour les notifications
export const notificationUtils = {
  generateRentReminderMessage: (locataireName: string, montant: number, dateEcheance: Date) => {
    return {
      titre: `Rappel de loyer - ${locataireName}`,
      message: `Bonjour ${locataireName},\n\nNous vous rappelons que votre loyer de ${moneyUtils.formatCurrency(montant)} est dû le ${dateUtils.formatDate(dateEcheance)}.\n\nMerci de procéder au paiement dans les meilleurs délais.\n\nCordialement,\nVotre propriétaire`
    }
  },

  generateMaintenanceReminderMessage: (description: string, dateEcheance: Date) => {
    return {
      titre: `Rappel de maintenance - ${description}`,
      message: `Une tâche de maintenance est prévue : ${description}\n\nDate prévue : ${dateUtils.formatDate(dateEcheance)}\n\nN'oubliez pas de planifier cette intervention.`
    }
  }
}

// Utilitaires pour l'export de données
export const exportUtils = {
  downloadCSV: (data: any[], filename: string) => {
    if (data.length === 0) return

    const headers = Object.keys(data[0])
    const csvContent = [
      headers.join(','),
      ...data.map(row => headers.map(header => `"${row[header] || ''}"`).join(','))
    ].join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    const url = URL.createObjectURL(blob)
    link.setAttribute('href', url)
    link.setAttribute('download', `${filename}.csv`)
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },

  prepareEcheancesForExport: (echeances: any[]) => {
    return echeances.map(echeance => ({
      'Date échéance': dateUtils.formatDate(echeance.date_echeance),
      'Type': echeance.type,
      'Description': echeance.description,
      'Montant': moneyUtils.formatCurrency(echeance.montant),
      'Statut': statusUtils.getEcheanceStatusLabel(echeance.statut),
      'Bien': echeance.biens?.nom || '',
      'Locataire': echeance.locataires ? `${echeance.locataires.nom} ${echeance.locataires.prenom || ''}`.trim() : '',
      'Date paiement': echeance.date_paiement ? dateUtils.formatDate(echeance.date_paiement) : ''
    }))
  }
}

// Utilitaires pour les calculs financiers
export const financialUtils = {
  calculateYearlyRevenue: (monthlyRevenue: number) => {
    return monthlyRevenue * 12
  },

  calculateOccupancyRate: (occupiedUnits: number, totalUnits: number) => {
    if (totalUnits === 0) return 0
    return Math.round((occupiedUnits / totalUnits) * 100)
  },

  calculateTotalPendingAmount: (echeances: any[]) => {
    return echeances
      .filter(e => e.statut === 'en_attente')
      .reduce((total, e) => total + e.montant, 0)
  },

  calculateMonthlyStats: (echeances: any[], month: number, year: number) => {
    const monthlyEcheances = echeances.filter(e => {
      const date = new Date(e.date_echeance)
      return date.getMonth() === month && date.getFullYear() === year
    })

    return {
      total: monthlyEcheances.reduce((sum, e) => sum + e.montant, 0),
      paid: monthlyEcheances.filter(e => e.statut === 'payee').reduce((sum, e) => sum + e.montant, 0),
      pending: monthlyEcheances.filter(e => e.statut === 'en_attente').reduce((sum, e) => sum + e.montant, 0),
      overdue: monthlyEcheances.filter(e => e.statut === 'en_retard').reduce((sum, e) => sum + e.montant, 0)
    }
  }
}

// Utilitaires pour les couleurs et thèmes
export const themeUtils = {
  getRandomGradient: () => {
    const gradients = [
      'from-blue-500 to-purple-600',
      'from-green-500 to-teal-600',
      'from-orange-500 to-red-600',
      'from-purple-500 to-pink-600',
      'from-teal-500 to-cyan-600',
      'from-indigo-500 to-blue-600'
    ]
    return gradients[Math.floor(Math.random() * gradients.length)]
  },

  getBienTypeColor: (type: string) => {
    const colors = {
      'appartement': 'bg-blue-100 text-blue-800',
      'maison': 'bg-green-100 text-green-800',
      'studio': 'bg-purple-100 text-purple-800',
      'autre': 'bg-gray-100 text-gray-800'
    }
    return colors[type as keyof typeof colors] || colors.autre
  }
}