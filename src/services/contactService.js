import axios from 'axios'

const endpoint = import.meta.env.VITE_CONTACT_ENDPOINT

export const contactService = {
  async sendMessage(payload) {
    if (!endpoint) {
      throw new Error('Contact endpoint is not configured')
    }

    const response = await axios.post(endpoint, payload)
    return response.data
  },
}
