import { useState, useEffect, ReactNode } from 'react';

interface DropdownProps {
    className: string;
    label: string;
    image: string;
    children: ReactNode;
}

function Dropdown({className, label, image, children}: DropdownProps) {

    const [isOpen, setOpen] = useState(false);
    const toggleDropdown = () => setOpen(!isOpen);
    const closeDropdown = (event: MouseEvent) => {
        if(!(event.target as Node).closest(".dropdown")) {
            setOpen(false);
        }
    };

    useEffect(()=> {
        document.addEventListener("click", closeDropdown);
        return () => {
            document.removeEventListener("click", closeDropdown);
        }
    }, []);

    if(image) {
        return (
            <div className={`dropdown ${className}`} onClick={toggleDropdown}>
                    <img src="src/assets/images/menu.svg" alt="An image."/>
                {isOpen && (
                    <div className="dropdown-menu">
                        {children}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className={`dropdown ${className}`} onClick={toggleDropdown}>
                {label}
            {isOpen && (
                <div className="dropdown-menu">
                    {children}
                </div>
            )}
        </div>
    );

}

export default Dropdown