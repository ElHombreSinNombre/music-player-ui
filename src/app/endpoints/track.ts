import { type Track } from '../models/track'
import trackParser from '../parsers/track'

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET
let tokenExpirationTime: number = 3600
let token: string | null = null

const getToken = async () => {
  const currentTime = Date.now()
  if (currentTime < tokenExpirationTime) {
    return token
  }
  if (clientId && clientSecret) {
    const headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }

    const body = `grant_type=client_credentials&client_id=${encodeURIComponent(
      clientId
    )}&client_secret=${encodeURIComponent(clientSecret)}`

    const requestOptions = {
      method: 'POST',
      headers: headers,
      body: body
    }

    const res = await fetch(
      'https://accounts.spotify.com/api/token',
      requestOptions
    )
    if (res.ok) {
      const data = await res.json()
      if (!data) {
        throw new Error('No data was received.')
      }
      tokenExpirationTime = currentTime + data['expires_in'] * 1000
      token = data['access_token']
      return token
    } else {
      throw new Error('Failed to fetch podcast')
    }
  }
  throw new Error('Client Id and Client Secret needed')
}

export const searchTrackByName = async ({
  name,
  limit = 10,
  offset = 0
}: {
  name: string
  limit?: number
  offset?: number
}): Promise<Track[]> => {
  const token = await getToken()
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${name}&type=track&limit=${limit}&offset=${offset}`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )

  if (res.ok) {
    const data = await res.json()
    if (!data) {
      throw new Error('No data was received.')
    }
    return trackParser(data.tracks.items)
  } else {
    throw new Error('Failed to fetch podcast')
  }
}

export const searchTrackByArtistId = async ({
  name,
  id
}: {
  name: string
  id: string
}): Promise<Track[]> => {
  const token = await getToken()
  let idOption: string | undefined = name ? await getArtistId(token, name) : id
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${idOption}/top-tracks?market=ES`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (res.ok) {
    const data = await res.json()
    if (!data) {
      throw new Error('No data was received.')
    }
    return trackParser(data.tracks)
  } else {
    throw new Error('Failed to fetch podcast')
  }
}

async function getArtistId(
  token: string | null,
  name: string
): Promise<string> {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${name}&type=artist`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (res.ok) {
    const data = await res.json()
    if (!data) {
      throw new Error('No data was received.')
    }
    return data.artists.items.at(0).id
  } else {
    throw new Error('Failed to fetch artist songs')
  }
}
