import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import '/src/assets/style/quotepopup.css';
import { useUserProfile } from "../../hooks/useUser";
import { RoleByOrdinal } from "../../models/Role";
import { RoleMetaMap } from "../../models/meta/RoleMeta";

interface AdminPopupProps {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (
        firstName: string,
        lastName: string,
        username: string,
        password: string,
        email: string,
        address: string,
        bio: string,
        balance: number,
        action: string,
        role: number
    ) => void;
}

const AdminPopup: React.FC<AdminPopupProps> = ({ isOpen, onClose, onSubmit }) => {
    const [action, setAction] = useState<string>('create');
    const [firstName, setFirstName] = useState<string>('');
    const [lastName, setLastName] = useState<string>('');
    const [username, setUserName] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [address, setAddress] = useState<string>('');
    const [bio, setBio] = useState<string>('');
    const [balance, setBalance] = useState(0);
    const [role, setRole] = useState<number>(0);

    // ✅ This hook must be called unconditionally
    const { profile, loading: profileLoading, error } = useUserProfile(username);

    useEffect(() => {
        if (profile && action === "edit") {
            if(username==='') return;
            setFirstName(profile.firstName || '');
            setLastName(profile.lastName || '');
            setUserName(profile.userName || '');
            setPassword('');
            setEmail(profile.email || '');
            setAddress(profile.address || '');
            setBio(profile.biography || '');
            setBalance(profile.balance || 0);
            setRole(RoleByOrdinal.indexOf(profile.role) || 0);
        }
    }, [profile, action]);

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        onSubmit(firstName, lastName, username, password, email, address, bio, balance, action, role);
    };

    // ✅ Safe to return here AFTER hooks are called
    if (!isOpen) return null;
    let bool = action==="create" || action==="delete";
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Admin Panel</h2>
                <p>Please select an action</p>

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label htmlFor="username">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                minLength={0}
                                value={username}
                                placeholder="Enter the username..."
                                onChange={(e) => setUserName(e.target.value)}
                              
                            />
                        </label> 
                       
                    </div>
                    
                   
                    <select className="select" value={action} onChange={(e) => setAction(e.target.value)}>
                        <option key="create" value="create">Create User</option>
                        <option key="edit" value="edit">Edit User</option>
                        <option key="delete" value="delete">Delete User</option>
                    </select>

                    <div className={`input-group ${bool && "disabled"}`}>
                        <label htmlFor="balance">
                            <img src="/src/assets/images/money.svg" />
                            <input
                                type="number"
                                id="balance"
                                name="balance"
                                min="0"
                                value={balance}
                                onChange={(e) => setBalance(Number(e.target.value))}
                                placeholder="Balance (in USD)"
                                step="0.01"
                                disabled={bool}
                            />
                        </label>
                        $ Balance
                    </div>

                    <div className={`input-group ${bool && "disabled"}`}>
                        <label htmlFor="bio">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="bio"
                                name="bio"
                                minLength={5}
                                value={bio}
                                placeholder="Biography"
                                onChange={(e) => setBio(e.target.value)}
                                disabled={bool}
                            />
                        </label>
                        Biography
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="password"
                                name="password"
                                minLength={0}
                                value={password}
                                placeholder="Enter the password..."
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </label> Password
                       
                    </div>

                    <div className="input-group">
                        <label htmlFor="firstname">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="firstname"
                                name="firstname"
                                minLength={5}
                                value={firstName}
                                placeholder="First Name"
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </label>
                        First Name
                    </div>

                    <div className="input-group">
                        <label htmlFor="lastname">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="lastname"
                                name="lastname"
                                minLength={5}
                                value={lastName}
                                placeholder="Last Name"
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </label>
                        Last Name
                    </div>

                    <div className="input-group">
                        <label htmlFor="email">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="email"
                                name="email"
                                minLength={5}
                                value={email}
                                placeholder="Email Address"
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </label>
                        Email Address
                    </div>

                    <div className="input-group">
                        <label htmlFor="address">
                            <img src="/src/assets/images/comment.svg" />
                            <input
                                type="text"
                                id="address"
                                name="address"
                                minLength={5}
                                value={address}
                                placeholder="Street Address"
                                onChange={(e) => setAddress(e.target.value)}
                            />
                        </label>
                        Street Address
                    </div>

                <select className={`select ${bool && "disabled"}`} value={role} onChange={(e)=>setRole(Number(e.target.value))} defaultValue={role} disabled={bool}>
                    {!bool && RoleByOrdinal.map((role, index) => (
                        <option key={index} value={index}>
                        {RoleMetaMap[role].icon} {RoleMetaMap[role].label}
                        </option>
                    ))}
                </select>

                    <div className="buttons">
                        <button type="submit" className="btn btn-primary">
                            Submit {action === "create" ? "Creation" : action === "edit" ? "Edit" : "Deletion"}
                        </button>
                        <a className="btn btn-danger pointer" onClick={onClose}>
                            Close
                        </a>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminPopup;
