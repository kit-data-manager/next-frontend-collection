import React, { useState } from "react";
interface IProps {
    open?: boolean;
    title: string;
    hiddenTitle: string;
}

const Collapsible: React.FC<IProps> = ({ open, children, title, hiddenTitle }) => {
    const [isOpen, setIsOpen] = useState(open);

    const titleValue = isOpen? title: hiddenTitle;

    const handleFilterOpening = () => {
        setIsOpen((prev) => !prev);

    };

    return (
        <>
            <div className="card mb-6">
                <div>
                    <div className="flex p-3 border-b-1 justify-content-between">
                        <h6 className="font-bold">{titleValue}</h6>
                        <button type="button" className="ml-6 align-self-end" onClick={handleFilterOpening}>
                            {!isOpen ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#000000" d="m5 6l5 5l5-5l2 1l-7 7l-7-7z"/></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 20 20"><path fill="#000000" d="m15 14l-5-5l-5 5l-2-1l7-7l7 7z"/></svg>
                            )}
                        </button>
                    </div>
            </div>
                <div className="border-bottom">
                    <div>{isOpen && <div className="p-3">{children}</div>}</div>
                </div>
            </div>
        </>
    );
};

export default Collapsible;
