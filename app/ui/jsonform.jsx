import React, { useRef, useEffect } from "react";
import './JsonForm.css'
import {Suspense} from 'react';

const useScript = (id , url) => {
    useEffect(() => {
        let script = document.getElementById(id);
        if(!script){
            script = document.createElement('script');
            script.src = url;
            script.id = id
            script.async = false;
        }

        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        }
    }, [url]);
};

const useCss = (id , url) => {
    useEffect(() => {
        let link = document.getElementById(id);
        if(!link){
            link = document.createElement('link');
            link.href = url;
            link.id = id;
            link.rel = "stylesheet"
            link.async = false;
        }

        document.body.appendChild(link);

        return () => {
            document.body.removeChild(link);
        }
    }, [url]);
};

export default function JsonForm(props) {
    let jsoneditor = undefined;
    let setEditorReady = props.setEditorReady;

    const elementRef = useRef();

    const defaultOptions = {
        iconlib: "fontawesome5",
        object_layout: "default",
        schema: props.schema,
        display_required_only: false,
        compact:false,
        disable_edit_json: true,
        prompt_before_delete: true,
        required_by_default: true,
        no_additional_properties: true,
        show_errors: "interaction",
        theme: "tailwind",
        startval: props.data || {}
    };


    // eslint-disable-next-line react-hooks/rules-of-hooks
    useScript('jsoneditor' ,'https://cdn.jsdelivr.net/npm/@json-editor/json-editor@2.15.0/dist/jsoneditor.min.js')
    useScript('tailwind','https://cdn.tailwindcss.com/')

    useCss('fontawesome5','https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css')
    useCss('jsoneditor-css', 'https://cdn.jsdelivr.net/npm/@json-editor/json-editor@2.15.0/src/themes/html.min.css')

    const validate = function(){
        const errors = jsoneditor.validate();

        return errors.length === 0;
    }
    const setUpEditor = () =>{
        jsoneditor = new window.JSONEditor(elementRef.current, defaultOptions);
        jsoneditor.on('change' , () => {
            if(validate()) {
                props.onChange(jsoneditor.getValue());
            }
        })
        jsoneditor.on('ready', () => {
            setEditorReady(true);
            // Now the api methods will be available
            if (props.enabled === false) {
                jsoneditor.disable();
            }
        });
    }
    const initJsoneditor = function () {
        // destroy old JSONEditor instance if exists
        if (jsoneditor) {
            jsoneditor.destroy();
        }

        if(window.JSONEditor){
            setUpEditor();
        }else{
            const inter =  setInterval(() => {
                if(window.JSONEditor){
                    setUpEditor()
                    clearInterval(inter)
                }
            }, 1000);
        }
    };
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            initJsoneditor();
        }

        return () => effectRan.current = true;
    }, []);

    return <div ref={elementRef}></div>;
}
