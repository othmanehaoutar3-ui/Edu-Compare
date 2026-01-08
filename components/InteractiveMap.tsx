'use client'

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import { LatLngExpression } from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { School } from '@/lib/schools'
import Link from 'next/link'
import { MapPin, Euro, TrendingUp, ExternalLink } from 'lucide-react'
import L from 'leaflet'

// Fix Leaflet icon issue with Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

// Coordonnées approximatives des grandes villes françaises
const cityCoordinates: Record<string, [number, number]> = {
    'Paris': [48.8566, 2.3522],
    'Lyon': [45.7640, 4.8357],
    'Marseille': [43.2965, 5.3698],
    'Toulouse': [43.6047, 1.4442],
    'Bordeaux': [44.8378, -0.5792],
    'Lille': [50.6292, 3.0573],
    'Nice': [43.7102, 7.2620],
    'Nantes': [47.2184, -1.5536],
    'Strasbourg': [48.5734, 7.7521],
    'Montpellier': [43.6108, 3.8767],
    'Rennes': [48.1173, -1.6778],
    'Grenoble': [45.1885, 5.7245],
    'Jouy-en-Josas': [48.7670, 2.1659],
    'Palaiseau': [48.7147, 2.2464],
    'Cergy': [49.0370, 2.0791],
    'Neuilly-sur-Seine': [48.8846, 2.2686],
    'Versailles': [48.8014, 2.1301],
    'Reims': [49.2583, 4.0317],
    'Clermont-Ferrand': [45.7772, 3.0870],
    'Angers': [47.4784, -0.5632],
}

const getCoordinates = (city: string): [number, number] => {
    // Cherche une correspondance exacte ou partielle
    const exactMatch = cityCoordinates[city]
    if (exactMatch) return exactMatch

    // Cherche une ville qui contient le nom
    const partialMatch = Object.keys(cityCoordinates).find((key) =>
        city.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(city.toLowerCase())
    )
    if (partialMatch) return cityCoordinates[partialMatch]

    // Par défaut, retourne Paris avec un petit décalage aléatoire
    return [48.8566 + (Math.random() - 0.5) * 0.1, 2.3522 + (Math.random() - 0.5) * 0.1]
}

// Icônes personnalisées
const createCustomIcon = (color: string) => {
    return L.divIcon({
        className: 'custom-marker',
        html: `
      <div style="
        background: ${color};
        width: 28px;
        height: 28px;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        border: 3px solid white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
      ">
        <div style="
          transform: rotate(45deg);
          color: white;
          font-size: 14px;
          margin-top: 3px;
          margin-left: 7px;
        ">📍</div>
      </div>
    `,
        iconSize: [28, 28],
        iconAnchor: [14, 28],
        popupAnchor: [0, -28],
    })
}

interface InteractiveMapProps {
    schools: School[]
}

export default function InteractiveMap({ schools }: InteractiveMapProps) {
    const center: LatLngExpression = [46.603354, 1.888334] // Centre de la France

    return (
        <MapContainer
            center={center}
            zoom={6}
            style={{ width: '100%', height: '100%' }}
            scrollWheelZoom={true}
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {schools.map((school) => {
                const position = getCoordinates(school.city)
                const icon = createCustomIcon(
                    school.sector === 'Public' ? '#10b981' : '#3b82f6'
                )

                return (
                    <Marker key={school.id} position={position} icon={icon}>
                        <Popup maxWidth={300} className="custom-popup">
                            <div className="p-2">
                                <h3 className="font-bold text-lg mb-2 text-purple-900">
                                    {school.name}
                                </h3>

                                <div className="space-y-2 text-sm">
                                    <div className="flex items-center gap-2 text-gray-700">
                                        <MapPin className="w-4 h-4" />
                                        <span>{school.city}</span>
                                    </div>

                                    <div className="flex items-center gap-2 text-gray-700">
                                        <span className={`px-2 py-1 rounded text-xs font-semibold ${school.sector === 'Public'
                                            ? 'bg-green-100 text-green-700'
                                            : 'bg-blue-100 text-blue-700'
                                            }`}>
                                            {school.sector}
                                        </span>
                                        <span className="text-gray-600">{school.type}</span>
                                    </div>

                                    <div className="flex items-center justify-between pt-2 border-t">
                                        <div className="flex items-center gap-1">
                                            <Euro className="w-4 h-4 text-purple-600" />
                                            <span className="font-semibold text-purple-900">
                                                {typeof school.price === 'number'
                                                    ? (school.price === 0 ? 'Gratuit' : `${school.price.toLocaleString()}€`)
                                                    : school.price}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <TrendingUp className="w-4 h-4 text-green-600" />
                                            <span className="font-semibold text-green-700">
                                                {school.rate}%
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <Link
                                    href={`/schools/${school.id}`}
                                    className="mt-3 w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white 
                    py-2 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 
                    transition-all flex items-center justify-center gap-2 text-sm"
                                >
                                    Voir détails
                                    <ExternalLink className="w-4 h-4" />
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                )
            })}
        </MapContainer>
    )
}
