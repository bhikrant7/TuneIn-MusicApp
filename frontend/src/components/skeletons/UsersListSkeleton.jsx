
const UsersListSkeleton = () => {
	return Array.from({ length: 4 }).map((_, i) => (
		<div key={i} className='flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg animate-pulse'>
			<div className='h-12 w-12 rounded-full bg-swatch-5/15' />
			<div className='flex-1 lg:block hidden'>
				<div className='h-4 w-24 bg-swatch-5/15 rounded mb-2' />
				<div className='h-3 w-32 bg-swatch-5/15 rounded' />
			</div>
		</div>
	));
};
export default UsersListSkeleton;
