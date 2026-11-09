interface Props {
  name: string;
}

const RestaurantHero: React.FC<Props> = ({ name }) => {
  return (
    <div className="relative h-64 md:h-80 bg-gray-900 overflow-hidden">
      <img
        src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80"
        className="w-full h-full object-cover opacity-60"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/80" />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <h1 className="text-3xl md:text-5xl font-extrabold text-white break-words">
          {name}
        </h1>
      </div>
    </div>
  );
};

export default RestaurantHero;
