import React from 'react';
import styles from './Button.module.scss';
function Button() {
    return (
        <div>
            <button className={styles.btn}>M</button>
            <button className={styles.btn2}>L</button>
        </div>
    );
}

export default Button;
