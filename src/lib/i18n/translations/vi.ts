import type { Dictionary } from "./en";

export const vi = {
  nav: {
    results: "Kết quả",
    pricing: "Bảng giá",
    faq: "Câu hỏi thường gặp",
    signIn: "Đăng nhập",
    getStarted: "Bắt đầu",
  },

  stickyCta: {
    label: "Bắt đầu",
    sub: "Thanh toán một lần · {photoCount} ảnh",
  },

  hero: {
    badge: "80% hồ sơ hẹn hò bị bỏ qua. Hãy là 20% còn lại",
    titleLine1: "Ảnh hẹn hò được thiết kế",
    titleAccent: "cho đôi mắt cô ấy",
    titleAccentAlt: "cho đôi mắt anh ấy",
    titleLine2: "không phải cho cái tôi của bạn",
    subtitle:
      "AI độc quyền của chúng tôi nghiên cứu điều gì thực sự khiến người ta dừng vuốt, rồi xây dựng lại hồ sơ của bạn bằng những bức ảnh tự nhiên, chất lượng tạp chí, phù hợp phong cách đời thường thật của bạn. Không có vẻ AI nhựa. Không có lỗi thấy rõ",
    cta: "Biến đổi hồ sơ của tôi",
    ctaSecondary: "Xem kết quả thật",
    ratingLabel:
      "được đánh giá bởi những người độc thân đã không còn bị bỏ qua",
  },

  trustBar: {
    label: "Được tin dùng bởi những người độc thân đang thắng trên",
  },

  proof: {
    kicker: "Con số thật khắc nghiệt",
    title: "Bạn chỉ có một lần vuốt để khiến cô ấy dừng lại",
    titleAlt: "Bạn chỉ có một lần vuốt để khiến anh ấy dừng lại",
    body: "80% hồ sơ hẹn hò bị bỏ qua, không phải vì con người, mà vì ảnh. Lời khuyên số 1 từ mọi huấn luyện viên hẹn hò đều giống nhau: sửa ảnh trước. Chúng tôi đã huấn luyện hệ thống AI độc quyền để được đánh giá là hấp dẫn mà vẫn giữ vẻ tự nhiên, không gượng gạo",
    stats: [
      {
        value: "75%",
        label: "hồ sơ bị bỏ qua trong chưa đầy một giây",
      },
      {
        value: "10x",
        label: "chất lượng match được cải thiện",
      },
      {
        value: "100+",
        label: "phút tiết kiệm mỗi tuần vì người bùng hẹn và biến mất",
      },
    ],
  },

  beforeAfter: {
    kicker: "Thẩm mỹ thật. Không lỗi",
    title: "Cùng một khuôn mặt. Ấn tượng đầu tiên hoàn toàn khác",
    body: "Mọi ảnh tham chiếu trong thư viện của chúng tôi đều được chọn tay vì hiệu quả gấp 10 lần trên app hẹn hò. AI độc quyền ánh xạ chúng theo phong cách đời thường thật của bạn, để ảnh trông như bạn trong ngày đẹp nhất, không phải bản render",
    toggleForHim: "Dành cho anh ấy",
    toggleForHer: "Dành cho cô ấy",
    toggleHint: "Ảnh được tối ưu cho người bạn muốn thu hút",
    beforeLabel: "Trước",
    afterLabel: "Sau",
    meterLabel: "Sức hút khi vuốt",
    meterBeforeCaption: "Bị bỏ qua",
    meterAfterCaption: "Được nhắn tin trước, hẹn hò tốt hơn, nhiều match hơn",
    disclaimer: "Biến đổi từ khách hàng chúng tôi đã làm việc cùng",
    examples: {
      him: [
        { beforeCaption: "Biến mất khiến tinh thần kiệt sức" },
        {
          beforeCaption: "Có trò chuyện nhưng hay bùng hẹn",
          afterCaption: "Được chọn ai để bùng hẹn",
        },
      ],
      her: [
        {
          beforeCaption: "Những buổi hẹn sơ sài",
          afterCaption: "Gặp được người trong mơ",
        },
        {
          beforeCaption: "Chỉ nhận những buổi hẹn thiếu cam kết",
          afterCaption: "Tìm được nửa kia của đời",
        },
      ],
    },
  },

  gaze: {
    kicker: "Lợi thế không công bằng",
    titleHim: "Thiết kế cho ánh mắt phụ nữ",
    titleHer: "Thiết kế cho ánh mắt nam giới",
    body: "Đàn ông chụp ảnh mà đàn ông khác thấy ngầu. Phụ nữ chọn ảnh bạn bè thích. Cả hai đều sai. Chúng tôi đảo ngược kỹ thuật những gì người bạn muốn thu hút thực sự phản hồi, khung hình tự nhiên, ánh sáng tự nhiên, môi trường thật, và huấn luyện hệ thống theo đó",
    toggleForHim: "Nam",
    toggleForHer: "Nữ",
    points: [
      {
        title: "Tự nhiên, không dàn dựng",
        body: "Ảnh trông như bạn bè có tài bắt được khoảnh khắc của bạn. Đó là điều tạo niềm tin và câu trả lời",
      },
      {
        title: "Ảnh tham chiếu chọn tay",
        body: "Mọi ảnh tham chiếu phong cách đều được chọn vì hiệu suất thống kê trên app hẹn hò. Không filler, không chân dung AI chung chung",
      },
      {
        title: "Thẩm mỹ thật của bạn",
        body: "Không da sáp, không tay méo, không uncanny valley. Nếu không giống ảnh thật, nó không bao giờ vào thư viện của bạn",
      },
    ],
  },

  profileBadge: {
    line1: "Trình tạo ảnh hồ sơ",
    line2: "hẹn hò số 1",
  },

  photoshoot: {
    kicker: "Tính toán thử",
    title: "Vượt trội vô hạn so với buổi chụp {photographerPrice}",
    body: "Nhiếp ảnh gia cho bạn một buổi chiều, một bộ đồ và ảnh la hét \u201cTôi thuê nhiếp ảnh gia cho hồ sơ hẹn hò.\u201d Chúng tôi cho bạn cả thư viện phong cách tự nhiên, sống trọn đời, với một phần nhỏ giá đó",
    themLabel: "Buổi chụp truyền thống",
    usLabel: "{appName}",
    rows: [
      {
        them: "{photographerPrice}+ cho một buổi",
        us: "Một lần thanh toán {price}, vậy thôi",
      },
      {
        them: "10-20 ảnh dùng được nếu may mắn",
        us: "{photoCount} ảnh qua các phong cách đã được chứng minh",
      },
      {
        them: "Một bộ đồ, một địa điểm, một vibe",
        us: "Hàng chục trang phục, bối cảnh và tâm trạng",
      },
      { them: "Rõ ràng gượng gạo và dàn dựng", us: "Tự nhiên, hòa vào feed" },
      {
        them: "Hàng tuần hẹn lịch và chờ đợi",
        us: "Sẵn sàng trong vài giờ, từ sofa nhà bạn",
      },
      { them: "Chụp lại? Trả thêm.", us: "100 chỉnh sửa AI đi kèm" },
    ],
    punchline:
      "Tình yêu đang cân bằng. Đừng giao cho người đã được trả tiền rồi",
  },

  match: {
    kicker: "Đích đến của hành trình",
    title: "Cuộc trò chuyện chất lượng hơn bắt đầu từ cú vuốt",
    body: "Nhiều match chỉ là khởi đầu. Khi ảnh của bạn cuối cùng thể hiện bạn thú vị và tự tin thế nào, buổi hẹn ít bùng hơn, trò chuyện mở đầu mạnh hơn, và \u201cbạn giống hệt ảnh\u201d trở thành lời khen, không phải sự nhẹ nhõm",
    imageAlt: "Màn hình match Tinder hiển thị It's a Match",
  },

  manifesto: {
    text: "Ảnh đẹp hơn nghĩa là match tốt hơn. Đơn giản vậy thôi. Lời khuyên số 1 mọi chuyên gia hẹn hò đều nói là chụp ảnh đại diện hẹn hò tốt hơn. Con người vốn là sinh vật thị giác. Chúng tôi dùng AI tiên tiến để quy trình đó siêu hợp lý và dễ như 1 2 3",
    attribution: "Vì sao chúng tôi xây dựng {appName}",
  },

  steps: {
    kicker: "Dễ như 1 2 3",
    title: "Lột xác của bạn, tự động",
    items: [
      {
        title: "Tải selfie lên",
        body: "10+ ảnh đời thường. AI học khuôn mặt bạn từ mọi góc",
      },
      {
        title: "AI xây dựng nhân vật của bạn",
        body: "Mô hình riêng của bạn, huấn luyện một lần, tái sử dụng mọi phong cách",
      },
      {
        title: "Tải xuống {photoCount} ảnh",
        body: "Phong cách chọn tay, không watermark, đúng kích thước mọi app hẹn hò",
      },
    ],
  },

  pricing: {
    kicker: "Một lần thanh toán. Không đăng ký",
    title: "Rẻ hơn một buổi hẹn đầu tệ",
    body: "Bạn sẽ chi nhiều hơn cho những buổi hẹn với match chất lượng thấp. Sửa ảnh một lần và trải nghiệm app hẹn hò của bạn sẽ thay đổi mãi mãi",
    planName: "Ảnh hồ sơ",
    features: [
      "{photoCount} ảnh hẹn hò do AI tạo",
      "100 chỉnh sửa AI, đổi trang phục, chỉnh bối cảnh hoặc nụ cười đẹp hơn",
      "Hơn 200+ phong cách và bối cảnh được chọn tay, hiệu quả cao",
      "Tối ưu cho người bạn muốn thu hút",
      "Tải xuống không watermark, sẵn sàng cho app",
      "Riêng tư: ảnh của bạn không bao giờ được chia sẻ",
      "Xử lý ưu tiên",
    ],
    cta: "Lấy ảnh của tôi",
    guarantee: "Ảnh huấn luyện của bạn được giữ riêng tư và lưu trữ an toàn",
    payoff: "Nếu một ảnh giúp bạn thêm một buổi hẹn tuyệt vời, nó đã hoàn vốn",
  },

  faq: {
    title: "Câu hỏi, đã trả lời",
    items: [
      {
        q: "Ảnh có thực sự giống tôi không?",
        a: "Có. AI huấn luyện trên khuôn mặt thật từ selfie bạn tải lên và khớp phong cách đời thường của bạn. Không uncanny valley, không da nhựa. Nếu ảnh không giống thật, tạo lại hoặc sửa bằng chỉnh sửa AI đi kèm",
      },
      {
        q: "Tại sao tốt hơn buổi chụp chuyên nghiệp?",
        a: "Buổi chụp {photographerPrice} chỉ mua được một bộ đồ, một địa điểm và ảnh gượng gạo rõ ràng. Bạn nhận cả thư viện phong cách tự nhiên, sống trọn đời, qua hàng chục bối cảnh, cộng chỉnh sửa AI, với một phần nhỏ giá đó, không cần rời nhà",
      },
      {
        q: "Tối ưu ánh mắt phụ nữ / nam giới nghĩa là gì?",
        a: "Ảnh tham chiếu phong cách được chọn tay dựa trên những gì người bạn muốn thu hút thực sự phản hồi, khung hình tự nhiên, bối cảnh tự nhiên, ánh sáng ấm, không phải điều ấn tượng với bạn. Đó là lý do chúng hiệu quả gấp 10 lần",
      },
      {
        q: "Tôi nhận ảnh nhanh thế nào?",
        a: "Huấn luyện nhân vật AI riêng của bạn mất khoảng 20-45 phút. Sau đó, mỗi ảnh tạo trong vài phút. Hầu hết người dùng có hồ sơ mới trong cùng ngày",
      },
      {
        q: "Tôi có thể sửa hình xăm, trang phục hoặc nền không?",
        a: "Có, mọi gói đều có chỉnh sửa AI. Thêm hoặc xóa hình xăm, đổi quần áo, xóa vật thể hoặc làm sạch nền bằng cách gõ một câu",
      },
      {
        q: "Dữ liệu của tôi có riêng tư không?",
        a: "Ảnh tải lên và ảnh tạo ra chỉ thuộc tài khoản của bạn. Chúng tôi không đăng, chia sẻ hay huấn luyện mô hình công khai bằng khuôn mặt bạn, và bạn có thể yêu cầu xóa bất cứ lúc nào",
      },
      {
        q: "Ảnh được lưu bao lâu và tín dụng có hiệu lực bao lâu?",
        a: "Ảnh tạo ra còn trong thư viện 1–2 tháng. Tín dụng có hiệu lực trọn một năm kể từ khi mua, đủ thời gian để tạo, chỉnh sửa và tải xuống",
      },
    ],
  },

  finalCta: {
    title: "Hãy là hồ sơ khiến mọi người dừng cuộn",
    body: "80% bị bỏ qua. 20% có ảnh tốt hơn. Tối nay bạn muốn là ai?",
    cta: "Bắt đầu",
  },

  footer: {
    tagline: "Ảnh hẹn hò AI được thiết kế để bạn được chú ý",
    support: "Có câu hỏi?",
    rights: "Bảo lưu mọi quyền",
  },
} satisfies Dictionary;
