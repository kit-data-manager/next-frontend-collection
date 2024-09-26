import ContentLoader from "react-content-loader";

export default function DataResourceCardSkeleton(props) {
    return (
        <ContentLoader
            speed={4}
            height={170}
            viewBox="0 0 600 190"
            backgroundColor="light-dark(#0c0c0b40, #27272A)"
            foregroundColor="light-dark(#09090B, #FAFAFA)"
            {...props}
        >
            <rect x="10" y="10" rx="5" ry="5" width="140" height="170"/>
            <rect x="160" y="15" rx="5" ry="5" width="60" height="20"/>
            <rect x="225" y="15" rx="5" ry="5" width="60" height="20"/>
            <rect x="290" y="15" rx="5" ry="5" width="60" height="20"/>

            <rect x="160" y="50" rx="5" ry="5" width="220" height="20"/>
            <rect x="160" y="75" rx="5" ry="5" width="220" height="10"/>
            <rect x="160" y="90" rx="5" ry="5" width="220" height="10"/>
            <rect x="160" y="170" rx="5" ry="5" width="60" height="10"/>
        </ContentLoader>
    );
}
