'use client';

import React, {useEffect, useRef} from "react";
import './JsonForm.css'

export default function JsonForm(props) {
    let jsoneditor = undefined;
    let setEditorReady = props.setEditorReady;

    const elementRef = React.useRef();

    const defaultOptions = {
        iconlib: "fontawesome5",
        object_layout: "table",
        schema: props.schema,
        display_required_only: false,
        compact: true,
        titleHidden: true,
        disable_edit_json: true,
        remove_empty_properties: true,
        remove_false_properties: true,
        disable_properties: true,
        prompt_before_delete: true,
        no_additional_properties: true,
        show_errors: "interaction",
        theme: "tailwind",
        use_name_attributes: true,
        template: 'handlebars',
        ajax: true,
        startval: props.data || {}
    };

    const validate = function () {
        const errors = jsoneditor.validate();
        console.log("Form validation errors: ", errors);
        return errors.length === 0;
    }

    const setUpEditor = () => {
        jsoneditor = new window.JSONEditor(elementRef.current, defaultOptions);
        jsoneditor.on('change', () => {
            if (validate()) {
                props.onChange(jsoneditor.getValue());
            } else {
                props.onChange(undefined);
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

        if (window.JSONEditor) {
            setUpEditor();
        } else {
            const inter = setInterval(() => {
                if (window.JSONEditor) {
                    setUpEditor()
                    clearInterval(inter)
                }
            }, 500);
        }
    };
    const effectRan = useRef(false);

    useEffect(() => {
        if (!effectRan.current) {
            initJsoneditor();
        }

        return () => effectRan.current = true;
    });

    return <div ref={elementRef}></div>;
}
