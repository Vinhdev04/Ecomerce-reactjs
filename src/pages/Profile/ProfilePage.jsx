/**
 * Profile settings UI page.
 * Rendering only; business logic lives in useProfilePage hook.
 */
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '@/components/Layout/Layout';
import useProfilePage from './useProfilePage';
import styles from './ProfilePage.module.scss';

function ProfilePage() {
    const {
        userInfo,
        profile,
        form,
        loading,
        saving,
        error,
        success,
        updateField,
        openLoginModal,
        submitProfile
    } = useProfilePage();

    const handleSubmit = async (e) => {
        e.preventDefault();
        await submitProfile();
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
                        onClick={openLoginModal}
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
