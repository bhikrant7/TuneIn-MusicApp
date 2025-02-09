const SectionGridSkeleton = () => {
	return (
		<div className='mb-8'>
			<div className='h-8 w-48 bg-swatch-5/15 rounded mb-4 animate-pulse' />
			<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
				{Array.from({ length: 4 }).map((_, i) => (
					<div key={i} className='bg-swatch-4/15 p-4 rounded-md animate-pulse'>
						<div className='aspect-square rounded-md bg-swatch-5/20 mb-4' />
						<div className='h-4 bg-swatch-5/20 rounded w-3/4 mb-2' />
						<div className='h-4 bg-swatch-5/20 rounded w-1/2' />
					</div>
				))}
			</div>
		</div>
	);
};
export default SectionGridSkeleton;