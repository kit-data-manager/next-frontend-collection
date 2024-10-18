import {InfinitySpin} from "react-loader-spinner";
import React from "react";

export default function Loader() {
    return (
        <div className="flex w-full h-full justify-center">
            <InfinitySpin
                width="200"
                color="#4fa94d"
            />
    </div>
    )
}
