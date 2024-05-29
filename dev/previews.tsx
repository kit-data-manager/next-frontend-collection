import React from 'react';
import {ComponentPreview, Previews} from '@react-buddy/ide-toolbox';
import {PaletteTree} from './palette';
import NavLinks from "@/app/ui/dashboard/nav-links";
import Page from "@/app/base-repo/(overview)/page";

const ComponentPreviews = () => {
    return (
        <Previews palette={<PaletteTree/>}>
            <ComponentPreview path="/NavLinks">
                <NavLinks/>
            </ComponentPreview>
            <ComponentPreview path="/Page">
                <Page/>
            </ComponentPreview>
        </Previews>
    );
};

export default ComponentPreviews;
