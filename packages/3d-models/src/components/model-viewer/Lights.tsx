import React from 'react';

/** Neutral three-point-ish lighting so emissive alert states still read well. */
export const Lights: React.FC = () => {
	return (
		<>
			<ambientLight intensity={0.6} />
			<directionalLight position={[5, 10, 7]} intensity={1.1} />
			<directionalLight position={[-6, 4, -5]} intensity={0.4} />
			<hemisphereLight args={['#ffffff', '#444444', 0.5]} />
		</>
	);
};
