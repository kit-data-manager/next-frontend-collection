import React from "react";

interface LayoutProps {
    className?: string;
    children?: React.ReactNode;
    header?: React.ReactNode;
    bodyContent?: React.ReactNode;
    bodyFooter?: React.ReactNode;
    bodyHeader?: React.ReactNode;
    sideContent?: React.ReactNode;
}

function MyLayout({
                    className,
                    children,
                    header,
                    bodyContent,
                    bodyFooter,
                    bodyHeader,
                    sideContent
                }: LayoutProps) {
    return (
        <div className={"sui-layout " + className}>
            <div className="sui-layout-header">
                <div className="sui-layout-header__inner">{header}</div>
            </div>
            <div className="sui-layout-body">
                <div className="sui-layout-body__inner">
                   <div className="sui-layout-main block min-w-full align-middle">
                        <div className="sui-layout-main-header">
                            <div className="sui-layout-main-header__inner">{bodyHeader}</div>
                        </div>
                        <div className="sui-layout-main-body ">
                            {children || bodyContent}
                        </div>
                        <div className="sui-layout-main-footer">{bodyFooter}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyLayout;
