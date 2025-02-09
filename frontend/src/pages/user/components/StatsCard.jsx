import { Card, CardContent } from "@/components/ui/card";

const StatsCard = ({ bgColor, icon: Icon, iconColor, label, value }) => {
	return (
		<Card className='bg-swatch-1/20 border-swatch-3/50 hover:bg-swatch-1 transition-colors'>
			<CardContent className='p-6'>
				<div className='flex items-center gap-4'>
					<div className={`p-3 rounded-lg ${bgColor}`}>
						<Icon className={`size-6 ${iconColor}`} />
					</div>
					<div>
						<p className='text-sm text-zinc-400'>{label}</p>
						<p className='text-2xl font-bold'>{value}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
};
export default StatsCard;