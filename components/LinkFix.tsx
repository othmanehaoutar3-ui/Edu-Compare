import 'next/link'

// Fix for the Next.js link import in InteractiveMap component
export default function Link(props: any) {
    return <a {...props} />
}
