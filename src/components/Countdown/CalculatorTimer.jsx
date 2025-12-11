import useCountdown from '../../hooks/useCountdown.js';
import styles from './CalculatorTimer.module.scss';

export default function CalculatorTimer({ endTime }) {
    const { days, hours, minutes, seconds } = useCountdown(endTime);

    const format = (num) => String(num).padStart(2, '0');

    const timeUnits = [
        { value: days, label: 'Days', color: 'purple' },
        { value: hours, label: 'Hours', color: 'blue' },
        { value: minutes, label: 'Minutes', color: 'orange' },
        { value: seconds, label: 'Seconds', color: 'gray' }
    ];

    return (
        <div className={styles.countdownContainer}>
            <div className={styles.timerWrapper}>
                {timeUnits.map((unit, index) => (
                    <div
                        key={index}
                        className={`${styles.timeBox} ${styles[unit.color]}`}
                    >
                        <div className={styles.timeValue}>
                            {format(unit.value)}
                        </div>
                        <div className={styles.timeLabel}>{unit.label}</div>
                        <div className={styles.trianglePointer}></div>
                    </div>
                ))}
            </div>
        </div>
    );
}
