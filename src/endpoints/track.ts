import { type Track } from '../types/track'
import trackParser from '../parsers/track'

const {
  NEXT_PUBLIC_CLIENT_ID: clientId = '',
  NEXT_PUBLIC_CLIENT_SECRET: clientSecret = ''
} = process.env

let token: string | null = null
let offset = 0

const getToken = async () => {
  if (!clientId || !clientSecret) {
    throw new Error('Client ID and Client Secret are required')
  }
  const credentials = `${encodeURIComponent(clientId)}:${encodeURIComponent(
    clientSecret
  )}`
  const base64Credentials = Buffer.from(credentials).toString('base64')
  const headers = {
    'Content-Type': 'application/x-www-form-urlencoded',
    Authorization: `Basic ${base64Credentials}`
  }
  const body = 'grant_type=client_credentials'
  const requestOptions = {
    method: 'POST',
    headers: headers,
    body: body
  }
  const res = await fetch(
    'https://accounts.spotify.com/api/token',
    requestOptions
  )
  if (!res.ok) {
    throw new Error('Failed to fetch access token')
  }
  if (res.ok) {
    const data = await res.json()
    if (!data) {
      throw new Error('No data was received')
    }
    token = data['access_token']
    return token
  }
}

const searchTrackByName = async ({
  name,
  more,
  limit = 10
}: {
  limit?: number
  name: string
  more?: boolean
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
  if (!res.ok) {
    throw new Error('Failed to fetch tracks')
  }
  const data = await res.json()
  if (!data) {
    throw new Error('No data was received')
  }
  let tracks = data.tracks.items
  if (data.tracks.next && more) {
    offset += 10
    const moreTracks = await moreTracksByName({ src: data.tracks.next })
    tracks = [...tracks, ...moreTracks]
  }
  return trackParser(tracks)
}

const moreTracksByName = async ({ src }: { src: string }): Promise<Track[]> => {
  const res = await fetch(src, {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
  if (!res.ok) {
    throw new Error('Failed to fetch tracks')
  }
  const data = await res.json()
  if (!data) {
    throw new Error('No data was received')
  }
  return trackParser(data.tracks.items)
}

const searchTrackByArtistId = async ({
  name,
  id
}: {
  name?: string
  id?: string
}): Promise<Track[]> => {
  let idOption: string | undefined = name ? await getArtistId({ name }) : id
  const res = await fetch(
    `https://api.spotify.com/v1/artists/${idOption}/top-tracks?market=ES`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (!res.ok) {
    throw new Error('Failed to fetch tracks')
  }
  const data = await res.json()
  if (!data) {
    throw new Error('No data was received')
  }
  return trackParser(data.tracks)
}

const getArtistId = async ({ name }: { name: string }): Promise<string> => {
  const res = await fetch(
    `https://api.spotify.com/v1/search?q=${name}&type=artist`,
    {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }
  )
  if (!res.ok) {
    throw new Error('Failed to fetch tracks')
  }
  const data = await res.json()
  if (!data) {
    throw new Error('No data was received')
  }
  return data.artists.items.at(0).id
}

export { searchTrackByArtistId, searchTrackByName }
