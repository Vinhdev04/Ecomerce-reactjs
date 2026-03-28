/**
 * Profile page logic hook:
 * handles profile fetch/update and exposes UI-ready state/actions.
 */
import { useContext, useEffect, useState } from 'react';
import { SideBarContext } from '@contexts/SideBarContext.js';
import { UserInfoContext } from '@contexts/UserInfoContext.js';
import { getMyProfile, updateMyProfile } from '@api/authServices.js';

const makeForm = (profile) => ({
    name: profile?.name || '',
    email: profile?.email || '',
    password: ''
});

export default function useProfilePage() {
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

    const openLoginModal = () => {
        setIsOpen(true);
        setType('login');
    };

    const submitProfile = async () => {
        if (!userInfo) return false;

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
            return true;
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    'Cap nhat profile that bai.'
            );
            return false;
        } finally {
            setSaving(false);
        }
    };

    return {
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
    };
}
