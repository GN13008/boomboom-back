import Artist from 'App/Models/Artist'
import Genre from 'App/Models/Genre'
import Track from 'App/Models/Track'
import axios from 'axios'
import UnAuthorizedException from 'App/Exceptions/UnAuthorizedException'
import TechnicalException from 'App/Exceptions/TechnicalException'
import ConfigurationService from 'App/Services/ConfigurationService'
import { inject } from '@adonisjs/fold'
import AuthProviders from 'App/Models/AuthProviders'
import User from 'App/Models/User'

type SpotifyApiArtist = {
  external_urls: {
    spotify: string
  }
  href: string
  id: string
  name: string
  type: 'artist'
  uri: `spotify:artist:${string}`
}

export type SpotifySearchTrackResponse = {
  tracks: {
    items: {
      album: {
        album_type: 'album'
        artists?: SpotifyApiArtist[]
        available_markets: string[]
        external_urls: string[]
        href: string
        id: string
        images?: string[]
        name?: string
        release_date: '2024-01-05'
        release_date_precision: 'day'
        total_tracks: number
        type: 'album'
        uri: `spotify:album:${string}`
      }
      artists?: SpotifyApiArtist[]
      available_markets: string[]
      disc_number: number
      duration_ms: number
      explicit: false
      external_ids: { isrc: string }
      external_urls: {
        spotify: string
      }
      href: string
      id: string
      is_local: false
      name: string
      popularity?: number
      preview_url: string
      track_number: 5
      type: 'track'
      uri: `spotify:track:${string}`
    }[]
  }
}

@inject()
export default class SpotifyService {
  private axiosInstance = axios.create({
    baseURL: ConfigurationService.getSpotifyApiUrl(),
    timeout: 1000,
  })

  constructor() {
    this.axiosInstance.interceptors.response.use(
      (response) => {
        // Any status code that lies within the range of 2xx causes this function to trigger
        return response
      },
      // TODO clean with adonis design pattern
      (error) => {
        if (error?.response?.status === 401) {
          throw new UnAuthorizedException()
        }
        console.log(error)
        throw new TechnicalException()
      }
    )
  }

  public async getArtists(userId) {
    const social = await AuthProviders.query().where('user_id', userId).first()

    const resp = await this.axiosInstance.get('/me/top/artists', {
      headers: {
        Authorization: `Bearer ${social?.accessToken}`,
      },
    })

    return resp?.data?.items
  }

  public async getTracks(userId) {
    const social = await AuthProviders.query().where('user_id', userId).first()
    const resp = await this.axiosInstance.get<SpotifySearchTrackResponse['tracks']>('/me/top/tracks?time_range=medium_term&limit=5', {
      headers: {
        Authorization: `Bearer ${social?.accessToken}`,
      },
    })
    return resp.data.items
  }

  public async saveArtists(userId, artists) {
    for (let artist of artists) {
      //store artists
      const newArtist = new Artist()
      newArtist.userId = userId
      newArtist.name = artist?.name
      newArtist.type = artist?.type
      newArtist.popularity = artist?.popularity
      newArtist.uri = artist?.uri
      newArtist.spotifyArtistId = artist?.id
      newArtist.artistImage = artist?.images ? artist?.images[0]?.url : null

      artist.genres = artist.genres?.map((name) => {
        let genre = new Genre()
        genre.name = name
        return genre
      })

      //store artists genres
      await newArtist.related('genres').saveMany(artist.genres)
    }
    return {
      status: true,
    }
  }

  public async saveTracks(userId, tracks) {
    for (let track of tracks) {
      //store tracks
      const newTrack = new Track()
      newTrack.userId = userId
      newTrack.uri = track.uri
      newTrack.popularity = track.popularity
      newTrack.name = track.name
      newTrack.trackId = track.id
      newTrack.album = track?.album?.name
      await newTrack.save()
    }
    return {
      status: true,
    }
  }

  public async getTracksByIds(userId, trackIds) {
    const commaSeparatedIds = trackIds.join(',')
    const social = await AuthProviders.query().where('user_id', userId).first()
    const resp = await this.axiosInstance.get(`/tracks?ids=${commaSeparatedIds}`, {
      headers: {
        Authorization: `Bearer ${social?.accessToken}`,
      },
    })
    return resp.data.tracks
  }

  public getTracksData(tracks) {
    const mappdTracks = tracks?.map((track) => {
      return {
        popularity: track.popularity,
        name: track.name,
        trackId: track.id,
        album: track?.albun?.name,
      }
    })

    return mappdTracks
  }

  public async updateFavorityTrack(userId, trackIds) {
    const markFavorite = await Track.query()
      .where('user_id', userId)
      .whereIn('track_id', trackIds)
      .update({
        favorite: 1,
      })

    return {
      status: true,
      data: markFavorite,
    }
  }

  public async getTracksByName(
    userId: User['id'],
    name: string
  ): Promise<SpotifySearchTrackResponse['tracks']['items']> {
    const social = await AuthProviders.query().where('user_id', userId).first()
    const resp = await this.axiosInstance.get<SpotifySearchTrackResponse>(
      `/search?q=track:${name}&type=track`,
      {
        headers: {
          Authorization: `Bearer ${social?.accessToken}`,
        },
      }
    )
    return resp.data.tracks.items
  }
}
