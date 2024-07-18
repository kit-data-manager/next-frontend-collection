"use client";

import React from "react";
import { FacetViewProps } from "@elastic/react-search-ui-views/lib/esm/types";
import {appendClassName} from "@elastic/react-search-ui-views/lib/esm/view-helpers";

function MyBooleanFacet({
                            className,
                            label,
                            options,
                            onChange,
                            onRemove,
                            values
                        }: FacetViewProps) {
    const trueOptions = options.find((option) => option.value === 1);
    if (!trueOptions) return null;

    const isSelected = options.length === 1;

    const apply = () => onChange(true);
    const remove = () => onRemove(true);
    const toggle = () => {
        isSelected ? remove() : apply();
    };

    return (
        <fieldset className={"sui-facet " + className}>
            <legend className="sui-facet__title">{label}</legend>
            <div className="sui-boolean-facet">
                <div className={"sui-boolean-facet__option-input-wrapper"}>
                    <label className="sui-boolean-facet__option-label">
                        <div className="sui-boolean-facet__option-input-wrapper">
                            <input
                                data-transaction-name={`facet - ${label}`}
                                className="sui-boolean-facet__checkbox"
                                type="checkbox"
                                onChange={toggle}
                                checked={isSelected}
                            />
                            <span className="sui-boolean-facet__input-text">{label}</span>
                        </div>
                        <span className="sui-boolean-facet__option-count">
              {trueOptions.count}
            </span>
                    </label>
                </div>
            </div>
        </fieldset>
    );
}

export default MyBooleanFacet;
