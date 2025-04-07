import { useState, useEffect, ReactNode } from "react";

interface SidePanelProps {
    className: string;
    children: ReactNode;
    isOpen: boolean;
    hasCloseButton: boolean;
    onClose: () => void;
}

function SidePanel({ className, children, isOpen, hasCloseButton, onClose}: SidePanelProps) {
    useEffect(() => {
        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        if (isOpen) {
            document.addEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "hidden"; // Prevent scrolling when open
        } else {
            document.body.style.overflow = "";
        }

        return () => {
            document.removeEventListener("keydown", handleKeyDown);
            document.body.style.overflow = "";
        };
    }, [isOpen, onClose]);

    if(hasCloseButton) {
    return (
        <div className={`sidepanel-overlay ${className} ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className="sidepanel" onClick={(e) => e.stopPropagation()}>
                <button className="close-btn" onClick={onClose}>×</button>
                {children}
            </div>
        </div>
        );
    }   

    return (
        <div className={`${className} sidepanel-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
            <div className="sidepanel" onClick={(e) => e.stopPropagation()}>
                {children}
            </div>
        </div>
    );

}

export default SidePanel;