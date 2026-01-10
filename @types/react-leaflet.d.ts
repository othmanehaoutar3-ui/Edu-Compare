// Ignore type checking for react-leaflet components
// eslint-disable-next-line @typescript-eslint/no-explicit-any
declare module 'react-leaflet' {
    export const MapContainer: any
    export const TileLayer: any
    export const Marker: any
    export const Popup: any
    export const useMap: any
    export const useMapEvents: any
}
