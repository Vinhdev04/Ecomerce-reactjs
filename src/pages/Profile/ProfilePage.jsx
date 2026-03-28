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

                <div className={styles.shell}>
                    <aside className={styles.accountPanel}>
                        <div className={styles.avatar}>
                            {(profile?.name || userInfo?.name || 'U')
                                .charAt(0)
                                .toUpperCase()}
                        </div>
                        <h2>{profile?.name || 'User'}</h2>
                        <p>{profile?.email}</p>

                        <div className={styles.metaGrid}>
                            <div className={styles.metaCard}>
                                <span>Role</span>
                                <strong>{profile?.role || 'CUSTOMER'}</strong>
                            </div>
                            <div className={styles.metaCard}>
                                <span>Status</span>
                                <strong>{profile?.status || 'ACTIVE'}</strong>
                            </div>
                        </div>
                    </aside>

                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <p className={styles.kicker}>Account settings</p>
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
                </div>
            </section>
        </Layout>
    );
}

export default ProfilePage;
