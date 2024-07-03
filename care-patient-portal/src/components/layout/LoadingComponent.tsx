import React from 'react';
import styles from '../../assets/styles/components/LoadingComponent.module.css';


export interface ILoadingComponent {
	show: boolean | undefined;
	loadingType: LoadingType;
	text: string | undefined;
}

export enum LoadingType {
	Spinning,
	CheckMark,
	XMark,
	Default,
}

const LoadingComponent: React.FC<ILoadingComponent> = (loadingComponent) => {
	const showSwitch = () => {

		switch (loadingComponent.loadingType) {
			case LoadingType.Spinning:
				return (
				<div className={styles.spinner}></div>
				);
			case LoadingType.CheckMark:
				return (
					<svg
						className={styles.circle}
						height="100"
						width="100"
						viewBox="0 0 100 100"
					>
						<circle
							cx="50"
							cy="50"
							r="40"
							strokeWidth="7"
							stroke="#13b887"
							fill="none"
						/>
						<polyline
							points="30,50 45,65 70,40"
							stroke="#13b887"
							strokeWidth="7"
							fill="none"
							className={styles.checkmark}
						/>
					</svg>
				);
			case LoadingType.XMark:
				return (
					<>
					<svg
   					className="xmark"
   					height="100"
    				width="100"
   					viewBox="0 0 100 100"
   					>
   					<circle
   					className="circle"
   					cx="50"
   					cy="50"
   					r="40"
   					strokeWidth="7"
   					stroke="#e02c4f"
   					fill="none"
    />
    <line
   					className="xmark-line"
   					x1="30"
   					y1="30"
   					x2="70"
   					y2="70"
   					stroke="#e02c4f"
   					strokeWidth="7"
   					/>
   					<line
   					className="xmark-line"
   					x1="70"
   					y1="30"
   					x2="30"
   					y2="70"
   					stroke="#e02c4f"
   					strokeWidth="7"
   					/>
   					</svg>
					</>
				);
			default:
				return (
   					<div className={styles.spinner}></div>
				);
		}
	};
	return (
		
			<>
		<div className={styles.container}>
			<div className={styles.loadingContainer}>
				   {showSwitch()}
	
			{
				loadingComponent.loadingType === LoadingType.Spinning
			}
			{
				loadingComponent.loadingType === LoadingType.CheckMark

				

			}
			{
				loadingComponent.loadingType === LoadingType.XMark
			}
			{
			<p className={styles.loadingDetails}>{loadingComponent.text}</p>
			}
	
		</div>
		</div>
			</>
	);
};

export default LoadingComponent;
