import { Link } from "react-router-dom";

const Header = () => {
	return (
		<div className='flex items-center justify-between'>
			<div className='flex items-center gap-3 mb-8'>
				<Link to='/' className='rounded-lg'>
					<img src='/logo.png' className='size-20 text-black' />
				</Link>
				<div>
					<h1 className='text-3xl font-bold'>User Dashboard</h1>
					<p className='text-zinc-400 mt-1'>Check your Stats here.</p>
				</div>
			</div>
			
		</div>
	);
};
export default Header;