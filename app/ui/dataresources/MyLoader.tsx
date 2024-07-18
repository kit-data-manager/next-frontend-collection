import React from "react"
import ContentLoader from "react-content-loader"

const MyLoader = (props) => (
    <div className="min-w-full rounded-lg">
            <ContentLoader viewBox="0 0 500 300" height={"100vh"} width={"100%"} {...props}>
                    <rect x="60" y="10" width="500" height="5"/>
                    <circle cx="20" cy="20" r="20"/>
            </ContentLoader>
    </div>

)

export default MyLoader
