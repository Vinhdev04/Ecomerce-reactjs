import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { getMyProfile, updateMyProfile } from '@api/authServices.js';
import styles from './ProfilePage.module.scss';

const makeForm = (profile) => ({
    name: profile?.name || '',
    email: profile?.email || '',
    password: ''
});

function ProfilePage() {
    const { userInfo, setUserInfo } = useContext(UserInfoContext);
    const { setIsOpen, setType } = useContext(SideBarContext);
    const [profile, setProfile] = useState(null);
    const [form, setForm] = useState(makeForm(userInfo));
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchProfile = async () => {
            if (!userInfo) {
                setLoading(false);
                return;
            }

            try {
                setLoading(true);
                setError('');
                const res = await getMyProfile();
                if (!res?.success || !res?.data) {
                    throw new Error(res?.message || 'Khong the tai profile.');
                }
                setProfile(res.data);
                setForm(makeForm(res.data));
            } catch (err) {
                setError(
                    err?.response?.data?.message ||
                        err?.message ||
                        'Khong the tai profile.'
                );
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [userInfo]);

    const updateField = (key, value) => {
        setForm((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userInfo) return;

        try {
            setSaving(true);
            setError('');
            setSuccess('');

            const payload = {
                name: form.name?.trim(),
                email: form.email?.trim(),
                ...(form.password ? { password: form.password } : {})
            };

            const res = await updateMyProfile(payload);
            if (!res?.success || !res?.data) {
                throw new Error(res?.message || 'Cap nhat profile that bai.');
            }

            setProfile(res.data);
            setUserInfo(res.data);
            setForm(makeForm(res.data));
            setSuccess('Cap nhat profile thanh cong.');
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    'Cap nhat profile that bai.'
            );
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className={`container ${styles.stateBox}`}>Dang tai profile...</div>
            </Layout>
        );
    }

    if (!userInfo) {
        return (
            <Layout>
                <div className={`container ${styles.stateBox}`}>
                    <p>Ban can dang nhap de cap nhat profile.</p>
                    <button
                        type="button"
                        className={styles.primaryBtn}
                        onClick={() => {
                            setIsOpen(true);
                            setType('login');
                        }}
                    >
                        Dang nhap
                    </button>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <section className={`container ${styles.profilePage}`}>
                <div className={styles.breadcrumb}>
                    <Link to="/">Home</Link>
                    <span>/</span>
                    <strong>Profile</strong>
                </div>

                <div className={styles.card}>
                    <div className={styles.cardHeader}>
                        <h1>Profile settings</h1>
                        <p>Cap nhat thong tin tai khoan ca nhan.</p>
                    </div>

                    <form onSubmit={handleSubmit} className={styles.formGrid}>
                        <label>
                            Ho ten
                            <input
                                value={form.name}
                                onChange={(e) => updateField('name', e.target.value)}
                                placeholder="Nhap ho ten"
                            />
                        </label>

                        <label>
                            Email
                            <input
                                value={form.email}
                                onChange={(e) => updateField('email', e.target.value)}
                                placeholder="Nhap email"
                                type="email"
                            />
                        </label>

                        <label>
                            Mat khau moi (tuy chon)
                            <input
                                value={form.password}
                                onChange={(e) => updateField('password', e.target.value)}
                                placeholder="De trong neu khong doi"
                                type="password"
                            />
                        </label>

                        <div className={styles.infoMeta}>
                            <span>
                                Role: <strong>{profile?.role || 'CUSTOMER'}</strong>
                            </span>
                            <span>
                                Status: <strong>{profile?.status || 'ACTIVE'}</strong>
                            </span>
                        </div>

                        {error && <p className={styles.errorText}>{error}</p>}
                        {success && <p className={styles.successText}>{success}</p>}

                        <button
                            type="submit"
                            className={styles.primaryBtn}
                            disabled={saving}
                        >
                            {saving ? 'Dang luu...' : 'Luu thay doi'}
                        </button>
                    </form>
                </div>
            </section>
        </Layout>
    );
}

export default ProfilePage;
