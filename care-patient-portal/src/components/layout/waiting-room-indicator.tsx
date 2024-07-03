// import { Box, createStyles, Text } from '@mantine/core';
// import { Link, useLocation } from 'react-router-dom';
// import { useEffect } from 'react';
// import { useConsultation } from '../../hooks/use-consultation';
// import useCountdown from '../../hooks/use-countdown';
// import { showNotification } from '@mantine/notifications';
// import useSound from 'use-sound';
// import { useTranslation } from 'react-i18next';
// import { useGuardedNavigation } from '../../pages/navigation';
// import useProfile from '../../hooks/use-profile';
// const WaitingRoomIndicator = ({ id }: { id: number }) => {
// 	const { user } = useProfile();
// 	const { navigate } = useGuardedNavigation();
// 	const location = useLocation();
// 	const { classes, cx } = useStyles();
// 	const { consultation } = useConsultation();
// 	const {
// 		minutes,
// 		seconds,
// 		retainTimestamp,
// 		updateTimer,
// 		completed,
// 		setCompleted,
// 	} = useCountdown({ id });
// 	const { t } = useTranslation(['default']);
// 	const timeBooked = consultation?.timeBooked
// 		? Date.parse(consultation?.timeBooked) -
// 		  Number(new Date().getTimezoneOffset() * 60 * 1000)
// 		: Date.now();
// 	const initTimestamp = retainTimestamp ? retainTimestamp : timeBooked;
// 	const timeDiff = Math.abs(Date.now() - initTimestamp);
// 	const initMinute = 14 - Math.floor(timeDiff / 1000 / 60);
// 	const initSeconds = 59 - Math.floor((timeDiff / 1000) % 60);
// 	const isRetain = Math.abs(Date.now() - timeBooked) > 1000 * 60 * 15;
// 	const timeIsUp = minutes <= 0 && seconds <= 0 && completed;
// 	const minuteString = minutes < 10 ? `0${minutes}` : minutes;
// 	const secondsString = seconds < 10 ? `0${seconds}` : seconds;
// 	const [accepted] = useSound('/assets/sounds/accepted.wav');
// 	const [started] = useSound('/assets/sounds/started.wav');
// 	const [time] = useSound('/assets/sounds/time.wav');
// 	useEffect(() => {
// 		let interval: string | number | NodeJS.Timer | undefined;
// 		if (
// 			consultation?.status === 'accepted' &&
// 			consultation.consultationType === 'VIRTUAL'
// 		) {
// 			accepted();
// 			if (location.pathname !== '/waitingroom') {
// 				showNotification({
// 					id: 'accepted',
// 					title: t('tr.accepted_title'),
// 					message: t('tr.accepted_message'),
// 					onClick: () => navigate('waitingroom'),
// 					sx: { cursor: 'pointer' },
// 					withCloseButton: false,
// 				});
// 			}
// 		}
// 		if (
// 			consultation?.status === 'started' &&
// 			consultation.consultationType === 'VIRTUAL'
// 		) {
// 			if (
// 				location.pathname !== '/call' &&
// 				consultation.consultationType === 'VIRTUAL'
// 			) {
// 				interval = setInterval(() => {
// 					started();
// 				}3000);
// 			}
// 			if (
// 				location.pathname !== '/waitingroom' &&
// 				location.pathname !== '/call'
// 			) {
// 				showNotification({
// 					id: 'started',
// 					title: t('tr.started_title'),
// 					message: t('tr.started_message'),
// 					onClick: () => navigate('call'),
// 					sx: { cursor: 'pointer' },
// 					withCloseButton: false,
// 				});
// 			}
// 		}
// 		return () => {
// 			clearInterval(interval);
// 		};
// 	}[consultation?.status, location.pathname]);
// 	useEffect(() => {
// 		if (timeIsUp) {
// 			time();
// 		}
// 	}[timeIsUp]);
// 	useEffect(() => {
// 		if (initMinute < 0) {
// 			return;
// 		}
// 		if (initMinute > 0 || initSeconds > 0) {
// 			setCompleted(false);
// 		}
// 		if (isRetain && retainTimestamp) {
// 			updateTimer(initMinute, initSeconds);
// 		}
// 		if (!isRetain && consultation?.timeBooked) {
// 			updateTimer(initMinute, initSeconds);
// 		}
// 	}[initMinute, initSeconds, retainTimestamp, completed, consultation]);
// 	if (
// 		location.pathname === '/waitingroom' ||
// 		location.pathname === '/call' ||
// 		consultation?.status === 'finished'
// 	) {
// 		return null;
// 	}
// 	if (consultation?.status === 'accepted') {
// 		return (
// 			<Link to={'/waitingroom'} className={classes.link}>
// 				<Box className={cx(classes.container, classes.accepted)}>
// 					<Text className={classes.timeString}>
// 						{t('tr.go_to_waitingroom')}
// 					</Text>
// 				</Box>
// 			</Link>
// 		);
// 	}
// 	if (consultation?.status === 'started') {
// 		return (
// 			<Link to={'/waitingroom'} className={classes.link}>
// 				<Box className={cx(classes.container, classes.started)}>
// 					<Text className={classes.timeString}>{t('tr.go_to_call')}</Text>
// 				</Box>
// 			</Link>
// 		);
// 	}
// 	return (
// 		<Link to={'/waitingroom'} className={classes.link}>
// 			<Box
// 				className={cx(classes.container, {
// 					[classes.accepted]: timeIsUp,
// 					[classes.waiting]: !timeIsUp,
// 				})}
// 			>
// 				<Text className={classes.timeString}>
// 					{user?.profileComplete && (
// 						<>
// 							{user.title.charAt(0).toUpperCase() + user.title.slice(1)}{' '}
// 							{user.surName}. Your doctor will call shortly!{' '}
// 							{timeIsUp
// 								? t('waitingRoom.go_to_waitingroom')
// 								: `${minuteString} : ${secondsString}`}
// 						</>
// 					)}
// 				</Text>
// 			</Box>
// 		</Link>
// 	);
// };
// export default WaitingRoomIndicator;
// const useStyles = createStyles(({ colors }) => ({
// 	link: {
// 		textDecoration: 'none',
// 	},
// 	container: {
// 		width: '100%',
// 		height: '1.8rem',
// 		background: colors.blue[7],
// 		color: '#333',
// 		fontSize: '.9rem',
// 		fontFamily: 'Poppins, sans-serif',
// 		fontWeight: 500,
// 	},
// 	waiting: {
// 		animation: `${waiting} 2s infinite`,
// 	},
// 	accepted: {
// 		animation: `${accepted} 2s infinite`,
// 	},
// 	started: {
// 		animation: `${started} 2s infinite`,
// 	},
// 	timeString: {
// 		padding: 1,
// 		textAlign: 'center',
// 		color: '#ffffff',
// 	},
// }));
// const waiting = ({
// 	'0%': {
// 		background: '#228BE6',
// 		// color: '#ffffff'
// 	},
// 	'50%': {
// 		background: '#15AABF',
// 		// color: '#ffffff'
// 	},
// 	'100%': {
// 		background: '#228BE6',
// 		// color: '#ffffff'
// 	},
// });
// const accepted = ({
// 	'0%': {
// 		background: '#F03E3E',
// 		// color: '#ffffff'
// 	},
// 	'50%': {
// 		background: '#D6336C',
// 		// color: '#ffffff'
// 	},
// 	'100%': {
// 		background: '#F03E3E',
// 		// color: '#ffffff'
// 	},
// });
// const started = ({
// 	'0%': {
// 		background: '#40C057',
// 	},
// 	'50%': {
// 		background: '#20C997',
// 	},
// 	'100%': {
// 		background: '#40C057',
// 	},
// });
import { Box, createStyles, Text } from '@mantine/core';
import { Link, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { useConsultation } from '../../hooks/use-consultation';
import useCountdown from '../../hooks/use-countdown';
import { showNotification } from '@mantine/notifications';
import useSound from 'use-sound';
import { useTranslation } from 'react-i18next';
import { useGuardedNavigation } from '../../pages/navigation';
import useProfile from '../../hooks/use-profile';

const WaitingRoomIndicator = ({ id }: { id: number }) => {
    const { user } = useProfile();
    const { navigate } = useGuardedNavigation();
    const location = useLocation();
    const { classes, cx } = useStyles();
    const { consultation } = useConsultation();
    const {
        minutes,
        seconds,
        retainTimestamp,
        updateTimer,
        completed,
        setCompleted,
    } = useCountdown({ id });
    const { t } = useTranslation(['default']);

    const timeBooked = consultation?.timeBooked
        ? Date.parse(consultation?.timeBooked) -
        Number(new Date().getTimezoneOffset() * 60 * 1000)
        : Date.now();
    const initTimestamp = retainTimestamp ? retainTimestamp : timeBooked;
    const timeDiff = Math.abs(Date.now() - initTimestamp);
    const initMinute = 14 - Math.floor(timeDiff / 1000 / 60);
    const initSeconds = 59 - Math.floor((timeDiff / 1000) % 60);
    const isRetain = Math.abs(Date.now() - timeBooked) > 1000 * 60 * 15;

    const timeIsUp = minutes <= 0 && seconds <= 0 && completed;
    const minuteString = minutes < 10 ? `0${minutes}` : minutes;
    const secondsString = seconds < 10 ? `0${seconds}` : seconds;

    const [accepted] = useSound('/assets/sounds/accepted.wav');
    const [started] = useSound('/assets/sounds/started.wav');
    const [time] = useSound('/assets/sounds/time.wav');

    useEffect(() => {
        let interval: string | number | NodeJS.Timer | undefined;
        if (
            consultation?.status === 'accepted' &&
            consultation.consultationType === 'VIRTUAL'
        ) {
            accepted();
            if (location.pathname !== '/waitingroom') {
                showNotification({
                    id: 'accepted',
                    title: t('tr.accepted_title'),
                    message: t('tr.accepted_message'),
                    onClick: () => navigate('waitingroom'),
                    sx: { cursor: 'pointer' },
                    withCloseButton: false,
                });
            }
        }
        if (
            consultation?.status === 'started' &&
            consultation.consultationType === 'VIRTUAL'
        ) {
            if (
                location.pathname !== '/call' &&
                consultation.consultationType === 'VIRTUAL'
            ) {
                interval = setInterval(() => {
                    started();
                }, 3000);
            }
            if (
                location.pathname !== '/waitingroom' &&
                location.pathname !== '/call'
            ) {
                showNotification({
                    id: 'started',
                    title: t('tr.started_title'),
                    message: t('tr.started_message'),
                    onClick: () => navigate('call'),
                    sx: { cursor: 'pointer' },
                    withCloseButton: false,
                });
            }
        }
        return () => {
            clearInterval(interval);
        };
    }, [consultation?.status, location.pathname]);

    useEffect(() => {
        if (timeIsUp) {
            time();
        }
    }, [timeIsUp]);

    useEffect(() => {
        if (initMinute < 0) {
            return;
        }
        if (initMinute > 0 || initSeconds > 0) {
            setCompleted(false);
        }
        if (isRetain && retainTimestamp) {
            updateTimer(initMinute, initSeconds);
        }
        if (!isRetain && consultation?.timeBooked) {
            updateTimer(initMinute, initSeconds);
        }
    }, [initMinute, initSeconds, retainTimestamp, completed, consultation]);

    if (
        location.pathname === '/waitingroom' ||
        location.pathname === '/call' ||
        consultation?.status === 'finished'
    ) {
        return null;
    }

    if (consultation?.status === 'accepted') {
        return (
					<Link to={'/waitingroom'} className={classes.link}>
						<Box className={cx(classes.container, classes.accepted)}>
							<Text className={classes.timeString}>
								{t('tr.go_to_waitingroom')}
							</Text>
						</Box>
					</Link>
				);
    }

    if (consultation?.status === 'started') {
        return (
            <Link to={'/waitingroom'} className={classes.link}>
                <Box className={cx(classes.container, classes.started)}>
                    <Text className={classes.timeString}>{t('tr.go_to_call')}</Text>
                </Box>
            </Link>
        );
    }

    return (
        <Link to={'/waitingroom'} className={classes.link}>
            <Box
                className={cx(classes.container, {
                    [classes.accepted]: timeIsUp,
                    [classes.waiting]: !timeIsUp,
                })}
            >
                <Text className={classes.timeString}>
                    {user?.profileComplete && (
                        <>
                            {user.title.charAt(0).toUpperCase() + user.title.slice(1)}{' '}
                            {user.surName}. {t('tr.your-doctor-will-call-shortly')}{' '}
                            {timeIsUp
                                ? t('tr.go_to_waitingroom')
                                : `${minuteString} : ${secondsString}`}
                        </>
                    )}
                </Text>
            </Box>
        </Link>
    );
};

export default WaitingRoomIndicator;

const useStyles = createStyles(({ colors }) => ({
    link: {
        textDecoration: 'none',
    },
    container: {
        width: '100%',
        height: '1.8rem',
        color: '#333',
        fontSize: '.9rem',
        fontFamily: 'Poppins, sans-serif',
        fontWeight: 500,
        padding: 1,
        textAlign: 'center',
    },
    waiting: {
        background: colors.blue[7],
    },
    accepted: {
        background: colors.red[7],
    },
    started: {
        background: colors.green[7],
    },
    timeString: {
        padding: 1,
        textAlign: 'center',
        color: '#ffffff',
    },
}));
