import { useState, useEffect, memo } from 'react';

import { Link } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import { Spin } from 'antd';

import imgUser from './img/user-placeholder.png'

import { Plus, SignOut, User, Users } from 'phosphor-react';
import { useModal } from '../../hooks/useModal';

import './Sidebar.css';

function SidebarComponent() {

    const [previewSource, setPreviewSource] = useState();
    const [loading, setLoading] = useState(false);
    const [user, setUser] = useState({});
    const [data, setData] = useState({
        name: "",
        image: ""
    });

    const { openModal, setModalType } = useModal();
    const location = useLocation();

    const handleChange = (name) => (e) => {
        const value = name === "image" ? e.target.files[0] : e.target.value;
        previewFile(value);
        setData({ ...data, [name]: value });
    };

    let formData = new FormData();
    formData.append("image", data.image);

    const previewFile = (file) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setPreviewSource(reader.result);
        }
    }

    const URL_USERS = process.env.REACT_APP_URL_USERS;

    const handleSubmit = async () => {
        setLoading(true)
        const userID = localStorage.getItem('user');
        try {
            await fetch(`${URL_USERS}/${userID}`, {
                method: "PATCH",
                body: formData
            })
                .then(res => res.json())
                .then(res => {
                    if (res) {
                        setLoading(false)
                        window.location.reload()
                    }
                })
        } catch (error) {
            return;
        }
    };

    useEffect(() => {
        const userID = localStorage.getItem('user')
        fetch(`${URL_USERS}/${userID}`)
            .then(async response => {
                const data = await response.json()
                setUser(data)
            })
    }, [location.pathname]);

    const logOut = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        localStorage.removeItem('profile');
    }

    const currentUserImg = () => {
        if (previewSource) {
            return previewSource
        }
        else if (user.avatar) {
            return user.avatar

        } else {
            return imgUser
        }
    }

    return (
        <section className="secUser">

            <div className='secUser__img'>
                <label className='secUser__label' htmlFor="uploadImage"><img src={currentUserImg()} alt="" /></label>
                <input onChange={handleChange("image")} id='uploadImage' type="file" />
                {previewSource && <button type='submit' onClick={handleSubmit}>{loading ? <Spin /> : "Salvar imagem"}</button>}
                <p>{user.name}</p>
            </div>

            <div className="btnsUser">
                <div className="user">
                    <Link to="/profile"><button className="btnIconUser"><User size={32} /></button></Link>
                    <Link to="/profile"><button className="btnUser">Perfil</button></Link>
                </div>

                <div className="user">
                    <button className="btnIconUser" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => {openModal(); setModalType('new')}}><Plus size={32} /></button>
                    <button className="btnUser" data-bs-toggle="modal" data-bs-target="#staticBackdrop" onClick={() => {openModal(); setModalType('new')}}>Publicar</button>
                </div>

                <div className="user">
                    <Link to="" /><button className="btnIconUser"><Users size={32} /> </button>
                    <Link to="" /><button className="btnUser">Amigos</button>
                </div>

                {/*<div className="user">
                    <Link to="" /><button className="btnIconUser"><i className="bi bi-file-earmark-code-fill"><img src={file} alt="" /></i></button>
                    <Link to="" /><button className="btnUser">Códigos</button>
                </div>
                */}
            </div>

            <div>
                <Link to="/"><button onClick={() => { logOut() }} className="btn-exit btnIconExit"><SignOut size={32} /></button></Link>
                <Link to="/"><button onClick={() => { logOut() }} className="btn-exit">Sair</button></Link>
            </div>
        </section>
    )
}

export const Sidebar = memo(SidebarComponent);