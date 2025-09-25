// Cinema systems → clusters → halls (frontend static catalog)

export const cinemaSystems = [
  {
    systemId: "CGV",
    name: "CGV Cinemas",
    logo: "/images/cgv-logo.png",
    clusters: [
      {
        clusterId: "CGV_A01",
        name: "CGV Vincom Đồng Khởi",
        address: "72 Lê Thánh Tôn, Q.1, TP.HCM",
        halls: [
          { hallId: "A01_H1", name: "Phòng 1", seats: 120, screenType: "2D" },
          { hallId: "A01_H2", name: "Phòng 2", seats: 160, screenType: "IMAX" },
          { hallId: "A01_H3", name: "Phòng 3", seats: 100, screenType: "3D" },
        ],
      },
      {
        clusterId: "CGV_A02",
        name: "CGV Landmark 81",
        address: "720A Điện Biên Phủ, Bình Thạnh, TP.HCM",
        halls: [
          {
            hallId: "A02_H1",
            name: "Phòng 1",
            seats: 180,
            screenType: "IMAX Laser",
          },
          { hallId: "A02_H2", name: "Phòng 2", seats: 140, screenType: "2D" },
        ],
      },
    ],
  },
  {
    systemId: "BHD",
    name: "BHD Star",
    logo: "/images/bhd-logo.png",
    clusters: [
      {
        clusterId: "BHD_B01",
        name: "BHD Bitexco",
        address: "2 Hải Triều, Q.1, TP.HCM",
        halls: [
          { hallId: "B01_H1", name: "Phòng 1", seats: 110, screenType: "2D" },
          { hallId: "B01_H2", name: "Phòng 2", seats: 130, screenType: "3D" },
        ],
      },
    ],
  },
  {
    systemId: "LOTTE",
    name: "Lotte Cinema",
    logo: "/images/lotte-logo.png",
    clusters: [
      {
        clusterId: "LOT_C01",
        name: "Lotte Gò Vấp",
        address: "242 Nguyễn Văn Lượng, Gò Vấp, TP.HCM",
        halls: [
          { hallId: "C01_H1", name: "Phòng 1", seats: 120, screenType: "2D" },
          { hallId: "C01_H2", name: "Phòng 2", seats: 90, screenType: "2D" },
        ],
      },
    ],
  },
];

// Helpers
export const getCinemaSystems = () => cinemaSystems;

export const getClustersBySystem = (systemId) => {
  const sys = cinemaSystems.find((s) => s.systemId === systemId);
  return sys ? sys.clusters : [];
};

export const getHallsByCluster = (clusterId) => {
  for (const sys of cinemaSystems) {
    const cl = sys.clusters.find((c) => c.clusterId === clusterId);
    if (cl) return cl.halls;
  }
  return [];
};
