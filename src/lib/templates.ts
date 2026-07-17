export const templates = [
  {
    id: "restaurant",
    name: "Restaurant",
    description: "Perfect for cafes, bistros, and fine dining",
    category: "Restaurant",
    thumbnail: "/templates/restaurant.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#8B4513",
      secondary_color: "#F5E6D3",
      font_family: "Playfair Display",
      button_style: "pill" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Café Bistro",
              links: [
                { label: "Home", href: "#" },
                { label: "Menu", href: "#menu" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ],
              cta_button: { label: "Reserve a Table", href: "#reserve" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Authentic Flavors,\nUnforgettable Moments",
              subheadline:
                "Experience culinary excellence crafted with passion and the freshest ingredients.",
              primary_button: { label: "View Our Menu", href: "#menu" },
              secondary_button: { label: "Book Now", href: "#book" },
              image_url: "",
              overlay: true,
            },
            styles: {
              padding: "120px 0",
              background_color: "#1A0F07",
              text_alignment: "center",
            },
          },
          {
            type: "features",
            content: {
              headline: "Why Choose Us",
              items: [
                {
                  icon: "ChefHat",
                  title: "Expert Chefs",
                  description: "Michelin-star trained culinary team",
                },
                {
                  icon: "Leaf",
                  title: "Fresh Ingredients",
                  description: "Locally sourced, organic produce daily",
                },
                {
                  icon: "Star",
                  title: "Ambiance",
                  description: "Elegant dining in a cozy atmosphere",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "about",
            content: {
              headline: "Our Story",
              body: "Founded in 2010, Café Bistro brings together the rich traditions of French cuisine with modern innovation. Every dish tells a story of passion, creativity, and dedication to excellence.",
              image_url: "",
              stats: [
                { label: "Years Served", value: "14+" },
                { label: "Happy Guests", value: "50K+" },
                { label: "Awards", value: "12" },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F9F5F0" },
          },
          {
            type: "services",
            content: {
              headline: "Our Services",
              items: [
                {
                  icon: "UtensilsCrossed",
                  title: "Dine-In",
                  description: "Full-service restaurant experience",
                },
                {
                  icon: "Truck",
                  title: "Catering",
                  description: "Events, parties, and corporate functions",
                },
                {
                  icon: "ShoppingBag",
                  title: "Takeout",
                  description: "Order online for quick pickup",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "gallery",
            content: {
              headline: "Our Gallery",
              images: ["", "", "", "", "", ""],
              columns: 3,
            },
            styles: { padding: "80px 0", background_color: "#F9F5F0" },
          },
          {
            type: "testimonials",
            content: {
              headline: "What Our Guests Say",
              items: [
                {
                  quote:
                    "An absolutely incredible dining experience. The tasting menu was a journey of flavors.",
                  author: "Sarah M.",
                  role: "Regular Guest",
                  rating: 5,
                },
                {
                  quote:
                    "Best restaurant in town! The service is impeccable and the food is divine.",
                  author: "James R.",
                  role: "Food Critic",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "faq",
            content: {
              headline: "Frequently Asked Questions",
              items: [
                {
                  question: "What are your opening hours?",
                  answer:
                    "We're open Monday-Saturday from 11:00 AM to 10:00 PM, and Sunday from 10:00 AM to 9:00 PM.",
                },
                {
                  question: "Do you accommodate dietary restrictions?",
                  answer:
                    "Yes! We offer vegetarian, vegan, and gluten-free options. Please inform your server of any allergies.",
                },
                {
                  question: "Can I make a reservation online?",
                  answer:
                    "Absolutely! Use our online booking system or give us a call for parties larger than 8.",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F9F5F0" },
          },
          {
            type: "contact",
            content: {
              headline: "Get In Touch",
              email: "hello@cafebistro.com",
              phone: "(555) 123-4567",
              address: "123 Gourmet Street, Foodville, FC 12345",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Café Bistro",
              description:
                "Where every meal is a celebration of flavor and community.",
              social_links: [
                { platform: "Facebook", url: "#" },
                { platform: "Instagram", url: "#" },
                { platform: "Twitter", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Café Bistro. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#1A0F07" },
          },
        ],
      },
    ],
  },
  {
    id: "coffee-shop",
    name: "Coffee Shop",
    description: "Warm and inviting for coffee lovers",
    category: "Coffee Shop",
    thumbnail: "/templates/coffee-shop.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#6F4E37",
      secondary_color: "#D4A574",
      font_family: "Lora",
      button_style: "rounded" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Brew House",
              links: [
                { label: "Home", href: "#" },
                { label: "Menu", href: "#menu" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ],
              cta_button: { label: "Order Now", href: "#order" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Crafted with Passion,\nServed with Love",
              subheadline:
                "Discover artisanal coffee blends roasted to perfection. Your perfect cup awaits.",
              primary_button: { label: "Explore Menu", href: "#menu" },
              secondary_button: { label: "Find Us", href: "#find" },
              image_url: "",
              overlay: true,
            },
            styles: {
              padding: "120px 0",
              background_color: "#2C1810",
              text_alignment: "center",
            },
          },
          {
            type: "features",
            content: {
              headline: "The Brew House Experience",
              items: [
                {
                  icon: "Coffee",
                  title: "Premium Beans",
                  description: "Single-origin from the best plantations",
                },
                {
                  icon: "Heart",
                  title: "Handcrafted",
                  description: "Every drink made with care and precision",
                },
                {
                  icon: "Home",
                  title: "Cozy Space",
                  description: "Relax, work, or catch up with friends",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "about",
            content: {
              headline: "Our Coffee Philosophy",
              body: "At Brew House, we believe coffee is more than a drink—it's a moment of connection. From ethically sourced beans to expert roasting, we pour our hearts into every cup.",
              image_url: "",
              stats: [
                { label: "Coffee Varieties", value: "25+" },
                { label: "Daily Cups Served", value: "500+" },
                { label: "Years of Passion", value: "8" },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FBF7F3" },
          },
          {
            type: "gallery",
            content: {
              headline: "Our Creations",
              images: ["", "", "", "", "", ""],
              columns: 3,
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "testimonials",
            content: {
              headline: "What Our Regulars Say",
              items: [
                {
                  quote:
                    "The best latte I've ever had! The atmosphere is perfect for remote work.",
                  author: "Emily K.",
                  role: "Remote Worker",
                  rating: 5,
                },
                {
                  quote:
                    "Their cold brew is absolutely amazing. A hidden gem in the city!",
                  author: "Mike T.",
                  role: "Coffee Enthusiast",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FBF7F3" },
          },
          {
            type: "contact",
            content: {
              headline: "Visit Us",
              email: "hello@brewhouse.com",
              phone: "(555) 234-5678",
              address: "456 Bean Street, Coffeesville, FC 23456",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Brew House",
              description: "Good coffee, good company, good times.",
              social_links: [
                { platform: "Instagram", url: "#" },
                { platform: "Facebook", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Brew House. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#2C1810" },
          },
        ],
      },
    ],
  },
  {
    id: "salon",
    name: "Salon & Spa",
    description: "Elegant and modern for beauty professionals",
    category: "Salon",
    thumbnail: "/templates/salon.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#9B59B6",
      secondary_color: "#F8E8FF",
      font_family: "Montserrat",
      button_style: "rounded" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Glamour Studio",
              links: [
                { label: "Home", href: "#" },
                { label: "Services", href: "#services" },
                { label: "Gallery", href: "#gallery" },
                { label: "Book", href: "#book" },
              ],
              cta_button: { label: "Book Appointment", href: "#book" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Transform Your Look,\nElevate Your Confidence",
              subheadline:
                "Premium salon services tailored to your unique style. Let our experts pamper you.",
              primary_button: { label: "Our Services", href: "#services" },
              secondary_button: { label: "Book Now", href: "#book" },
              image_url: "",
              overlay: true,
            },
            styles: {
              padding: "120px 0",
              background_color: "#1A0A1E",
              text_alignment: "center",
            },
          },
          {
            type: "services",
            content: {
              headline: "Our Services",
              items: [
                {
                  icon: "Scissors",
                  title: "Hair Styling",
                  description: "Cuts, colors, and treatments by top stylists",
                },
                {
                  icon: "Sparkles",
                  title: "Nail Art",
                  description: "Manicure, pedicure, and creative designs",
                },
                {
                  icon: "Flower2",
                  title: "Spa Treatments",
                  description: "Facials, massages, and wellness rituals",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "gallery",
            content: {
              headline: "Our Work",
              images: ["", "", "", "", "", "", "", ""],
              columns: 4,
            },
            styles: { padding: "80px 0", background_color: "#FBF7F3" },
          },
          {
            type: "testimonials",
            content: {
              headline: "Client Love",
              items: [
                {
                  quote:
                    "Absolutely love my new haircut! The stylist really listened to what I wanted.",
                  author: "Jessica L.",
                  role: "Regular Client",
                  rating: 5,
                },
                {
                  quote:
                    "The spa package was heavenly. I left feeling like a new person!",
                  author: "Amanda R.",
                  role: "Spa Lover",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "contact",
            content: {
              headline: "Book Your Appointment",
              email: "hello@glamourstudio.com",
              phone: "(555) 345-6789",
              address: "789 Beauty Ave, Stylington, FC 34567",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FBF7F3" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Glamour Studio",
              description: "Where beauty meets artistry.",
              social_links: [
                { platform: "Instagram", url: "#" },
                { platform: "Pinterest", url: "#" },
                { platform: "Facebook", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Glamour Studio. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#1A0A1E" },
          },
        ],
      },
    ],
  },
  {
    id: "portfolio",
    name: "Portfolio",
    description: "Showcase your creative work beautifully",
    category: "Portfolio",
    thumbnail: "/templates/portfolio.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#2563EB",
      secondary_color: "#DBEAFE",
      font_family: "Inter",
      button_style: "rounded" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Alex Chen",
              links: [
                { label: "Work", href: "#work" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ],
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Designing Experiences\nThat Matter",
              subheadline:
                "I'm a product designer crafting meaningful digital experiences for forward-thinking brands.",
              primary_button: { label: "View My Work", href: "#work" },
              secondary_button: { label: "Get in Touch", href: "#contact" },
              image_url: "",
              overlay: false,
            },
            styles: {
              padding: "100px 0",
              background_color: "#F8FAFC",
              text_alignment: "left",
            },
          },
          {
            type: "features",
            content: {
              headline: "What I Do",
              items: [
                {
                  icon: "Palette",
                  title: "UI/UX Design",
                  description: "User-centered interfaces that delight",
                },
                {
                  icon: "Code",
                  title: "Frontend Dev",
                  description: "Clean, performant code",
                },
                {
                  icon: "Lightbulb",
                  title: "Brand Identity",
                  description: "Visual identities that tell stories",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "about",
            content: {
              headline: "About Me",
              body: "I'm a multidisciplinary designer with 6+ years of experience helping startups and established brands bring their digital visions to life. I believe great design is invisible—it just feels right.",
              image_url: "",
              stats: [
                { label: "Projects Delivered", value: "80+" },
                { label: "Happy Clients", value: "45+" },
                { label: "Years Experience", value: "6" },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F8FAFC" },
          },
          {
            type: "contact",
            content: {
              headline: "Let's Work Together",
              email: "hello@alexchen.design",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Alex Chen",
              description: "Designing for impact.",
              social_links: [
                { platform: "Dribbble", url: "#" },
                { platform: "LinkedIn", url: "#" },
                { platform: "Twitter", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Alex Chen. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#0F172A" },
          },
        ],
      },
    ],
  },
  {
    id: "freelancer",
    name: "Freelancer",
    description: "Professional presence for independent pros",
    category: "Freelancer",
    thumbnail: "/templates/freelancer.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#059669",
      secondary_color: "#D1FAE5",
      font_family: "Inter",
      button_style: "rounded" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Sarah Mitchell",
              links: [
                { label: "Services", href: "#services" },
                { label: "Work", href: "#work" },
                { label: "Contact", href: "#contact" },
              ],
              cta_button: { label: "Hire Me", href: "#contact" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Bringing Your Ideas\nto Life",
              subheadline:
                "Freelance web developer & designer helping small businesses build their online presence.",
              primary_button: { label: "See My Work", href: "#work" },
              secondary_button: { label: "Let's Talk", href: "#contact" },
              image_url: "",
              overlay: false,
            },
            styles: {
              padding: "100px 0",
              background_color: "#F0FDF4",
              text_alignment: "center",
            },
          },
          {
            type: "services",
            content: {
              headline: "Services I Offer",
              items: [
                {
                  icon: "Monitor",
                  title: "Web Development",
                  description: "Custom websites built with modern tech",
                },
                {
                  icon: "Paintbrush",
                  title: "Web Design",
                  description: "Beautiful, user-friendly interfaces",
                },
                {
                  icon: "ShoppingCart",
                  title: "E-Commerce",
                  description: "Online stores that drive sales",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "testimonials",
            content: {
              headline: "What Clients Say",
              items: [
                {
                  quote:
                    "Sarah delivered beyond expectations. Our website looks amazing!",
                  author: "Tom W.",
                  role: "Small Business Owner",
                  rating: 5,
                },
                {
                  quote:
                    "Professional, creative, and incredibly responsive. Highly recommend!",
                  author: "Lisa K.",
                  role: "Startup Founder",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F0FDF4" },
          },
          {
            type: "contact",
            content: {
              headline: "Let's Build Something Great",
              email: "hello@sarahmitchell.dev",
              phone: "(555) 456-7890",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Sarah Mitchell",
              description: "Building the web, one project at a time.",
              social_links: [
                { platform: "GitHub", url: "#" },
                { platform: "LinkedIn", url: "#" },
                { platform: "Twitter", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Sarah Mitchell. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#065F46" },
          },
        ],
      },
    ],
  },
  {
    id: "agency",
    name: "Agency",
    description: "Modern and bold for creative agencies",
    category: "Agency",
    thumbnail: "/templates/agency.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#7C3AED",
      secondary_color: "#EDE9FE",
      font_family: "Inter",
      button_style: "square" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Nova Agency",
              links: [
                { label: "Work", href: "#work" },
                { label: "Services", href: "#services" },
                { label: "About", href: "#about" },
                { label: "Contact", href: "#contact" },
              ],
              cta_button: { label: "Start a Project", href: "#contact" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "We Build Brands\nThat Matter",
              subheadline:
                "A creative agency specializing in branding, web design, and digital strategy for ambitious companies.",
              primary_button: { label: "Our Work", href: "#work" },
              secondary_button: { label: "Contact Us", href: "#contact" },
              image_url: "",
              overlay: true,
            },
            styles: {
              padding: "120px 0",
              background_color: "#0F0A1E",
              text_alignment: "center",
            },
          },
          {
            type: "services",
            content: {
              headline: "What We Do",
              items: [
                {
                  icon: "Rocket",
                  title: "Brand Strategy",
                  description: "Positioning and identity development",
                },
                {
                  icon: "PenTool",
                  title: "Visual Design",
                  description: "UI/UX, graphics, and motion design",
                },
                {
                  icon: "Globe",
                  title: "Web Development",
                  description: "Custom websites and web applications",
                },
                {
                  icon: "Megaphone",
                  title: "Marketing",
                  description: "Digital campaigns and content strategy",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "about",
            content: {
              headline: "Our Approach",
              body: "We're a team of designers, developers, and strategists who believe in the power of bold ideas. Every project starts with listening, followed by obsessive craft.",
              image_url: "",
              stats: [
                { label: "Projects Delivered", value: "200+" },
                { label: "Team Members", value: "15" },
                { label: "Client Satisfaction", value: "98%" },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F5F3FF" },
          },
          {
            type: "testimonials",
            content: {
              headline: "Client Success",
              items: [
                {
                  quote:
                    "Nova transformed our brand completely. Our revenue grew 40% in 3 months!",
                  author: "David P.",
                  role: "CEO, TechStart",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "contact",
            content: {
              headline: "Start Your Project",
              email: "hello@novaagency.com",
              phone: "(555) 567-8901",
              address: "100 Innovation Drive, Creativille, FC 45678",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#F5F3FF" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Nova Agency",
              description: "Bold ideas, exceptional execution.",
              social_links: [
                { platform: "Instagram", url: "#" },
                { platform: "LinkedIn", url: "#" },
                { platform: "Dribbble", url: "#" },
                { platform: "Twitter", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Nova Agency. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#0F0A1E" },
          },
        ],
      },
    ],
  },
  {
    id: "small-business",
    name: "Small Business",
    description: "Clean and professional for local businesses",
    category: "Small Business",
    thumbnail: "/templates/small-business.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#2563EB",
      secondary_color: "#EFF6FF",
      font_family: "Inter",
      button_style: "rounded" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "Main Street Co.",
              links: [
                { label: "Home", href: "#" },
                { label: "About", href: "#about" },
                { label: "Services", href: "#services" },
                { label: "Contact", href: "#contact" },
              ],
              cta_button: { label: "Get a Quote", href: "#contact" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Your Trusted Local\nBusiness Partner",
              subheadline:
                "Serving our community with quality products and exceptional service since 1995.",
              primary_button: { label: "Learn More", href: "#about" },
              secondary_button: { label: "Contact Us", href: "#contact" },
              image_url: "",
              overlay: false,
            },
            styles: {
              padding: "100px 0",
              background_color: "#EFF6FF",
              text_alignment: "left",
            },
          },
          {
            type: "features",
            content: {
              headline: "Why Choose Us",
              items: [
                {
                  icon: "Shield",
                  title: "Trusted Since 1995",
                  description: "Decades of service excellence",
                },
                {
                  icon: "Users",
                  title: "Community Focused",
                  description: "We put our customers first",
                },
                {
                  icon: "Award",
                  title: "Award Winning",
                  description: "Recognized for quality service",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "services",
            content: {
              headline: "Our Services",
              items: [
                {
                  icon: "Briefcase",
                  title: "Consulting",
                  description: "Expert advice tailored to your needs",
                },
                {
                  icon: "Wrench",
                  title: "Support",
                  description: "Reliable ongoing support when you need it",
                },
                {
                  icon: "Star",
                  title: "Quality Guarantee",
                  description: "Satisfaction guaranteed on every service",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F8FAFC" },
          },
          {
            type: "about",
            content: {
              headline: "Our Mission",
              body: "For over 25 years, Main Street Co. has been dedicated to providing top-quality products and services to our local community. We believe in building lasting relationships through trust, integrity, and exceptional service.",
              image_url: "",
              stats: [
                { label: "Years in Business", value: "25+" },
                { label: "Happy Customers", value: "10,000+" },
                { label: "Team Members", value: "50" },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "testimonials",
            content: {
              headline: "What Our Customers Say",
              items: [
                {
                  quote:
                    "The best service in town! They always go above and beyond.",
                  author: "Robert J.",
                  role: "Loyal Customer",
                  rating: 5,
                },
                {
                  quote:
                    "Professional, reliable, and fair pricing. Highly recommended!",
                  author: "Maria G.",
                  role: "Small Business Owner",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#EFF6FF" },
          },
          {
            type: "contact",
            content: {
              headline: "Get In Touch",
              email: "info@mainstreetco.com",
              phone: "(555) 678-9012",
              address: "500 Main Street, Smalltown, FC 56789",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "footer",
            content: {
              logo_text: "Main Street Co.",
              description: "Your trusted local partner since 1995.",
              social_links: [
                { platform: "Facebook", url: "#" },
                { platform: "Instagram", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} Main Street Co. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#1E3A5F" },
          },
        ],
      },
    ],
  },
  {
    id: "landing-page",
    name: "Landing Page",
    description: "High-converting single page for campaigns",
    category: "Landing Page",
    thumbnail: "/templates/landing-page.svg",
    preview_url: "",
    global_settings: {
      primary_color: "#E11D48",
      secondary_color: "#FFE4E6",
      font_family: "Inter",
      button_style: "pill" as const,
    },
    pages: [
      {
        name: "Home",
        slug: "",
        sections: [
          {
            type: "navbar",
            content: {
              logo_text: "LaunchKit",
              links: [
                { label: "Features", href: "#features" },
                { label: "Pricing", href: "#pricing" },
                { label: "FAQ", href: "#faq" },
              ],
              cta_button: { label: "Get Started Free", href: "#signup" },
            },
            styles: { padding: "16px 0", background_color: "#FFFFFF" },
          },
          {
            type: "hero",
            content: {
              headline: "Launch Your Product\nin Minutes, Not Months",
              subheadline:
                "The all-in-one platform that helps you build, launch, and grow your digital product with zero hassle.",
              primary_button: { label: "Start Free Trial", href: "#signup" },
              secondary_button: { label: "Watch Demo", href: "#demo" },
              image_url: "",
              overlay: false,
            },
            styles: {
              padding: "100px 0",
              background_color: "#FFF1F2",
              text_alignment: "center",
            },
          },
          {
            type: "features",
            content: {
              headline: "Everything You Need",
              subheadline: "Powerful features to accelerate your growth",
              items: [
                {
                  icon: "Zap",
                  title: "Lightning Fast",
                  description: "Optimized for speed and performance",
                },
                {
                  icon: "Shield",
                  title: "Secure by Default",
                  description: "Enterprise-grade security built-in",
                },
                {
                  icon: "Layers",
                  title: "Easy Integration",
                  description: "Works with your favorite tools",
                },
                {
                  icon: "BarChart3",
                  title: "Analytics",
                  description: "Real-time insights and reporting",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "testimonials",
            content: {
              headline: "Loved by Teams Everywhere",
              items: [
                {
                  quote:
                    "LaunchKit transformed how we bring products to market. Absolutely essential tool.",
                  author: "Sarah J.",
                  role: "Product Manager",
                  rating: 5,
                },
                {
                  quote:
                    "We launched in half the time. The ROI has been incredible.",
                  author: "Mark T.",
                  role: "Startup Founder",
                  rating: 5,
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#F8FAFC" },
          },
          {
            type: "faq",
            content: {
              headline: "Frequently Asked Questions",
              items: [
                {
                  question: "Is there a free trial?",
                  answer:
                    "Yes! Start with a 14-day free trial, no credit card required.",
                },
                {
                  question: "Can I upgrade my plan later?",
                  answer:
                    "Absolutely. You can upgrade, downgrade, or cancel anytime.",
                },
                {
                  question: "Do you offer support?",
                  answer:
                    "Yes, we offer 24/7 support via chat and email for all plans.",
                },
              ],
            },
            styles: { padding: "80px 0", background_color: "#FFFFFF" },
          },
          {
            type: "contact",
            content: {
              headline: "Get Started Today",
              email: "hello@launchkit.io",
              show_form: true,
            },
            styles: { padding: "80px 0", background_color: "#FFF1F2" },
          },
          {
            type: "footer",
            content: {
              logo_text: "LaunchKit",
              description: "Build faster. Launch smarter.",
              social_links: [
                { platform: "Twitter", url: "#" },
                { platform: "LinkedIn", url: "#" },
              ],
              copyright: `© ${new Date().getFullYear()} LaunchKit. All rights reserved.`,
            },
            styles: { padding: "60px 0", background_color: "#0F172A" },
          },
        ],
      },
    ],
  },
];

export const sectionTypes = [
  { id: "navbar", label: "Navigation", icon: "Menu" },
  { id: "hero", label: "Hero", icon: "Layout" },
  { id: "features", label: "Features", icon: "Grid3X3" },
  { id: "about", label: "About", icon: "Info" },
  { id: "services", label: "Services", icon: "Briefcase" },
  { id: "gallery", label: "Gallery", icon: "Image" },
  { id: "testimonials", label: "Testimonials", icon: "MessageSquareQuote" },
  { id: "faq", label: "FAQ", icon: "HelpCircle" },
  { id: "contact", label: "Contact", icon: "Mail" },
  { id: "footer", label: "Footer", icon: "Copyright" },
  { id: "spacer", label: "Spacer", icon: "MoveVertical" },
  { id: "divider", label: "Divider", icon: "Minus" },
] as const;

export const categories = [
  "Restaurant",
  "Coffee Shop",
  "Salon",
  "Portfolio",
  "Freelancer",
  "Agency",
  "Small Business",
  "Landing Page",
];

export const fontOptions = [
  { value: "Inter", label: "Inter" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Lora", label: "Lora" },
  { value: "Poppins", label: "Poppins" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Merriweather", label: "Merriweather" },
];

export const defaultColors = {
  primary: "#2563EB",
  secondary: "#EFF6FF",
  background: "#FFFFFF",
  text: "#0F172A",
  muted: "#64748B",
  accent: "#7C3AED",
};
