import prisma from "../lib/prisma.lib.js";

async function main() {
  console.log("🌱 Bắt đầu seed dữ liệu sản phẩm...");

  // Xóa dữ liệu cũ (nếu có)
  await prisma.product.deleteMany({});
  console.log("🗑️  Đã xóa dữ liệu cũ");

  const products = [
    {
      image: [
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=500",
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=600",
        "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=700"
      ],
      title: "PlayStation 5 DualSense Wireless Controller",
      description:
        "Tay cầm không dây PS5 với công nghệ haptic feedback và adaptive triggers, mang đến trải nghiệm chơi game chân thực và sống động.",
      price: 1599000,
      category: "PlayStation Controllers",
      stock: 45,
      size: ["S", "M", "L"],
      rating: 4.8,
      badge: "Bestseller"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=500",
        "https://images.unsplash.com/photo-1612287230202-1ff1d85d1bdf?w=600"
      ],
      title: "Xbox Series X|S Wireless Controller - Carbon Black",
      description:
        "Tay cầm Xbox không dây với thiết kế ergonomic, nút bấm chính xác cao. Tương thích với Xbox Series X|S, Xbox One và PC.",
      price: 1399000,
      category: "Xbox Controllers",
      stock: 30,
      size: ["S", "M", "L"],
      rating: 4.7,
      badge: "New"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=500",
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=600",
        "https://images.unsplash.com/photo-1578303512597-81e6cc155b3e?w=700"
      ],
      title: "Nintendo Switch Pro Controller",
      description:
        "Tay cầm chuyên nghiệp cho Nintendo Switch với cảm biến gyro, HD rumble và pin 40 giờ chơi liên tục.",
      price: 1699000,
      category: "Nintendo Controllers",
      stock: 25,
      size: ["S", "M", "L"],
      rating: 4.6,
      badge: null
    },
    {
      image: [
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=500",
        "https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=600"
      ],
      title: "Razer Wolverine V2 Pro - Gaming Controller",
      description:
        "Tay cầm gaming chuyên nghiệp với 6 nút bấm có thể tùy chỉnh, mecha-tactile buttons và HyperSpeed Wireless.",
      price: 4999000,
      category: "Premium Controllers",
      stock: 15,
      size: ["S", "M", "L"],
      rating: 4.9,
      badge: "Premium"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=500",
        "https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=600",
        "https://images.unsplash.com/photo-1625805866449-3589fe3f71a3?w=700"
      ],
      title: "8BitDo Pro 2 Bluetooth Gamepad",
      description:
        "Tay cầm đa nền tảng hỗ trợ Switch, PC, Android, macOS. Thiết kế retro kết hợp hiện đại.",
      price: 1299000,
      category: "Multi-Platform Controllers",
      stock: 40,
      size: ["S", "M", "L"],
      rating: 4.5,
      badge: "Hot Deal"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1592840062661-5e88e27c1854?w=500",
        "https://images.unsplash.com/photo-1592840062661-5e88e27c1854?w=600"
      ],
      title: "SteelSeries Stratus Duo Wireless Controller",
      description:
        "Tay cầm không dây cho PC, Android và VR. Pin 20+ giờ, kết nối Bluetooth và 2.4GHz wireless.",
      price: 1799000,
      category: "PC Controllers",
      stock: 20,
      size: ["S", "M", "L"],
      rating: 4.4,
      badge: null
    },
    {
      image: [
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=500",
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=600",
        "https://images.unsplash.com/photo-1551103782-8ab07afd45c1?w=700"
      ],
      title: "Logitech F710 Wireless Gamepad",
      description:
        "Tay cầm không dây cho PC với thiết kế console-style. Tích hợp dual vibration motors và D-pad 4 chiều.",
      price: 899000,
      category: "PC Controllers",
      stock: 35,
      size: ["S", "M", "L"],
      rating: 4.3,
      badge: "Budget"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=500",
        "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=600"
      ],
      title: "SCUF Reflex Pro - Custom PS5 Controller",
      description:
        "Tay cầm PS5 custom cao cấp với paddle buttons, trigger stops và grip tùy chỉnh. Dành cho game thủ chuyên nghiệp.",
      price: 5499000,
      category: "Premium Controllers",
      stock: 8,
      size: ["S", "M", "L"],
      rating: 4.9,
      badge: "Premium"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1600080972464-8e5f35bc1e49?w=500",
        "https://images.unsplash.com/photo-1600080972464-8e5f35bc1e49?w=600",
        "https://images.unsplash.com/photo-1600080972464-8e5f35bc1e49?w=700"
      ],
      title: "PowerA Enhanced Wired Controller for Xbox",
      description:
        "Tay cầm có dây giá rẻ cho Xbox với dual rumble motors và 3.5mm audio jack. Chiều dài dây 3m.",
      price: 699000,
      category: "Xbox Controllers",
      stock: 50,
      size: ["S", "M", "L"],
      rating: 4.2,
      badge: "Budget"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=500",
        "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?w=600"
      ],
      title: "Hori Fighting Commander - Arcade Controller",
      description:
        "Tay cầm chuyên dụng cho game đối kháng với 6 nút mặt trước. Tương thích PS4, PS5, và PC.",
      price: 2299000,
      category: "Fighting Game Controllers",
      stock: 12,
      size: ["S", "M", "L"],
      rating: 4.7,
      badge: "Specialty"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=500",
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=600",
        "https://images.unsplash.com/photo-1587202372634-32705e3bf49c?w=700"
      ],
      title: "DualSense Edge Wireless Controller",
      description:
        "Tay cầm PS5 cao cấp với stick modules thay thế, back buttons và profile settings. Kèm case bảo vệ.",
      price: 5199000,
      category: "PlayStation Controllers",
      stock: 18,
      size: ["S", "M", "L"],
      rating: 4.8,
      badge: "Premium"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=500",
        "https://images.unsplash.com/photo-1580910051074-3eb694886505?w=600"
      ],
      title: "Nintendo Switch Joy-Con Pair - Neon Red/Blue",
      description:
        "Cặp Joy-Con chính hãng Nintendo với motion controls, HD rumble và IR Motion Camera. Có thể chơi riêng lẻ hoặc gắn vào console.",
      price: 1899000,
      category: "Nintendo Controllers",
      stock: 28,
      size: ["S", "M", "L"],
      rating: 4.5,
      badge: "Bestseller"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=500",
        "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=600",
        "https://images.unsplash.com/photo-1612198188060-c7c2a3b66eae?w=700"
      ],
      title: "Xbox Elite Wireless Controller Series 2",
      description:
        "Tay cầm Xbox cao cấp với 4 paddle, stick tension điều chỉnh và pin 40 giờ. Kèm charging dock và case.",
      price: 4299000,
      category: "Premium Controllers",
      stock: 10,
      size: ["S", "M", "L"],
      rating: 4.9,
      badge: "Premium"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=500",
        "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?w=600"
      ],
      title: "Thrustmaster T80 Ferrari 488 GTB Edition",
      description:
        "Vô lăng racing chuyên dụng với pedal set và force feedback. Tương thích PS4 và PC. Thiết kế Ferrari chính hãng.",
      price: 3299000,
      category: "Racing Controllers",
      stock: 6,
      size: ["S", "M", "L"],
      rating: 4.6,
      badge: "Specialty"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1600080972464-8e5f35bc1e49?w=500",
        "https://images.unsplash.com/photo-1600080972464-8e5f35bc1e49?w=600",
        "https://images.unsplash.com/photo-1600080972464-8e5f35bc1e49?w=700"
      ],
      title: "Backbone One Mobile Gaming Controller",
      description:
        "Tay cầm gắn smartphone cho iOS và Android. Kết nối Lightning/USB-C, pass-through charging, tương thích cloud gaming.",
      price: 2499000,
      category: "Mobile Controllers",
      stock: 22,
      size: ["S", "M", "L"],
      rating: 4.7,
      badge: "New"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=500",
        "https://images.unsplash.com/photo-1605901309584-818e25960a8f?w=600"
      ],
      title: "GameSir X2 Pro Mobile Controller",
      description:
        "Tay cầm mobile với Hall Effect sticks, trigger buttons và cooling fan tích hợp. Hỗ trợ điện thoại 110-179mm.",
      price: 1899000,
      category: "Mobile Controllers",
      stock: 19,
      size: ["S", "M", "L"],
      rating: 4.5,
      badge: "Hot Deal"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=500",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=600",
        "https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=700"
      ],
      title: "Steam Deck Dock Official",
      description:
        "Dock chính hãng cho Steam Deck với HDMI 2.0, Gigabit Ethernet và 3 USB-A 3.1 ports. Hỗ trợ output 4K 60Hz.",
      price: 2199000,
      category: "Accessories",
      stock: 15,
      size: ["S", "M", "L"],
      rating: 4.6,
      badge: null
    },
    {
      image: [
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=500",
        "https://images.unsplash.com/photo-1607853202273-797f1c22a38e?w=600"
      ],
      title: "Victrix Gambit Dual Core Tournament Controller",
      description:
        "Tay cầm tournament-grade cho Xbox và PC với 14 buttons tùy chỉnh. Dual CoreTM technology giảm input lag xuống 2ms.",
      price: 3799000,
      category: "Premium Controllers",
      stock: 7,
      size: ["S", "M", "L"],
      rating: 4.8,
      badge: "Premium"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=500",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=600",
        "https://images.unsplash.com/photo-1542751371-adc38448a05e?w=700"
      ],
      title: "Astro C40 TR Wireless Controller",
      description:
        "Tay cầm PS4/PC cao cấp với module sticks và D-pad hoán đổi được. Software tuning và pin 12 giờ chơi không dây.",
      price: 4599000,
      category: "Premium Controllers",
      stock: 5,
      size: ["S", "M", "L"],
      rating: 4.7,
      badge: "Premium"
    },
    {
      image: [
        "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=500",
        "https://images.unsplash.com/photo-1614624532983-4ce03382d63d?w=600"
      ],
      title: "Retro-Bit Sega Saturn Wireless Controller",
      description:
        "Tay cầm retro cho PC, Nintendo Switch, Android. Thiết kế kinh điển Sega Saturn với kết nối Bluetooth hiện đại.",
      price: 999000,
      category: "Retro Controllers",
      stock: 24,
      size: ["S", "M", "L"],
      rating: 4.4,
      badge: "Retro"
    }
  ];

  // Insert từng sản phẩm để tránh lỗi
  let count = 0;
  for (const product of products) {
    await prisma.product.create({
      data: product
    });
    count++;
    console.log(`✅ Đã thêm sản phẩm ${count}/20: ${product.title}`);
  }

  console.log(`\n🎉 Hoàn thành! Đã seed ${count} sản phẩm vào database`);
}

main()
  .catch((e) => {
    console.error("❌ Lỗi khi seed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log("🔌 Đã ngắt kết nối database");
  });