// Banners/Advertisements data for frontend
export const bannersData = [
  {
    bannerId: "B001",
    image: "/images/01z014xatxra1646636458786.jpg",
    title: "Khuyến mãi đặc biệt",
    subtitle: "Giảm 50% vé xem phim cuối tuần",
    description:
      "Tận hưởng những bộ phim hay nhất với giá ưu đãi chỉ có trong tuần này",
    buttonText: "Đặt vé ngay",
    buttonLink: "/booking",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    priority: 1,
  },
  {
    bannerId: "B002",
    image: "/images/TGMAV_SAlone_16_9_1920x1080_1781067_1920x1080.jpg",
    title: "Phim mới ra mắt",
    subtitle: "Top Gun: Maverick - Trải nghiệm điện ảnh đỉnh cao",
    description:
      "Khám phá những cảnh bay hoành tráng và câu chuyện cảm động trong Top Gun: Maverick",
    buttonText: "Xem trailer",
    buttonLink: "/movies/M005",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    priority: 2,
  },
  {
    bannerId: "B003",
    image: "/images/img-corn-drink-banner.png",
    title: "Combo bắp nước",
    subtitle: "Mua combo tiết kiệm đến 20%",
    description: "Thưởng thức bắp nước ngon lành với giá ưu đãi đặc biệt",
    buttonText: "Mua ngay",
    buttonLink: "/combos",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    priority: 3,
  },
  {
    bannerId: "B004",
    image: "/images/1-inside-1429373709505.jpg",
    title: "Rạp chiếu mới",
    subtitle: "CGV Landmark 81 - Trải nghiệm xem phim đẳng cấp",
    description: "Khám phá rạp chiếu mới với công nghệ IMAX và Dolby Atmos",
    buttonText: "Khám phá",
    buttonLink: "/cinemas",
    startDate: "2024-01-01",
    endDate: "2024-12-31",
    isActive: true,
    priority: 4,
  },
];

// Helper functions
export const getActiveBanners = () => {
  return bannersData.filter((banner) => banner.isActive);
};

export const getBannerById = (bannerId) => {
  return bannersData.find((banner) => banner.bannerId === bannerId);
};

export const getBannersByPriority = () => {
  return bannersData
    .filter((banner) => banner.isActive)
    .sort((a, b) => a.priority - b.priority);
};
