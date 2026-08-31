# TÀI LIỆU Ý TƯỞNG THIẾT KẾ GAME (GAME DESIGN DOCUMENT - GDD)
## Dự án: Đào Vàng Ngữ Pháp & Giọng Nói (Gold Miner English)

Tài liệu này tổng hợp toàn bộ chiến lược tâm lý giáo dục và cấu trúc kỹ thuật đã thảo luận để phát triển tựa game học tiếng Anh tương tác bằng giọng nói hiệu quả.

---

## 1. TỔNG QUAN DỰ ÁN & CƠ CHẾ CỐT LÕI (CORE LOOP)

*   **Tên dự án dự kiến:** Gold Miner English (Đào Vàng Ngữ Pháp)
*   **Thể loại:** Game Giáo dục (EdTech), Arcade/Puzzle, Multiplayer.
*   **Nền tảng mục tiêu:** Web Game (HTML5/WebGL) để tối ưu hóa khả năng tiếp cận không cần tải app.
*   **Cơ chế cốt lõi (Core Mechanic):** Giữ nguyên cơ chế căn góc và thả móc ngoạm gây nghiện của game Đào Vàng cổ điển. Tuy nhiên, các vật thể dưới lòng đất sẽ là từ vựng, ngữ pháp, hoặc cụm từ. **Giọng nói của người chơi chính là vũ khí/nút bấm kích hoạt.**

### Vòng lặp game (Core Loop):
```
Đào từ vựng/ngữ pháp vượt ải ➔ Nhận Vàng/Kim cương ➔ Vào Cửa hàng nâng cấp trang bị/Mua chủ đề ➔ Thách đấu Multiplayer / Chơi màn khó hơn
```

---

## 2. ỨNG DỤNG TÂM LÝ HỌC & GIÁO DỤC (ĐỘ LÔI CUỐN & HIỆU QUẢ)

*   **Vùng phát triển gần nhất (ZPD):** Game tự động điều chỉnh độ khó để giữ người học luôn ở trạng thái tập trung cao độ (Flow), không quá dễ gây chán, không quá khó gây nản.
*   **Lặp lại ngắt quãng (Spaced Repetition System - SRS):** Thuật toán tính toán đẩy các từ vựng/cấu trúc đã học xuất hiện lại dưới dạng chướng ngại vật hoặc Boss theo chu kỳ (1 ngày, 3 ngày, 7 ngày).
*   **Giảm bộ lọc cảm xúc (Lowering Affective Filter):** Thiết kế NPC thân thiện, không phán xét, tạo môi trường an toàn để người học dám "sai và sửa" khi phát âm.
*   **Loss Aversion (Nỗi sợ mất mát):** Áp dụng cơ chế Chuỗi ngày học (Streak) để kích hoạt thói quen vào game mỗi ngày.

---

## 3. THIẾT KẾ LỘ TRÌNH 4 VÙNG ĐẤT (TỪ DỄ ĐẾN KHÓ)

Để đảm bảo người chơi tiến bộ rõ rệt và phản xạ tự nhiên sau khi phá đảo, cấu trúc màn chơi được chia làm 4 giai đoạn chuẩn khung CEFR:

### Chương 1: Vùng Đất Nhận Diện (Trình độ: Nhập môn)
*   **Nhiệm vụ:** Tích lũy từ vựng đơn và phát âm chuẩn từ đơn.
*   **Cơ chế:** Gắp từ tương ứng với hình ảnh/gợi ý. Khi kéo lên, bắt buộc phải phát âm chuẩn từ đó qua Micro để nhận 100% giá trị tiền vàng.

### Chương 2: Thung Lũng Cấu Trúc (Trình độ: Sơ cấp A1)
*   **Nhiệm vụ:** Nắm chắc cấu trúc câu khẳng định/phủ định và các thì cơ bản (Hiện tại đơn, Quá khứ đơn).
*   **Cơ chế:** Bản đồ xuất hiện các "Khung chứa câu" rỗng (`[Subject]` ➔ `[Verb]` ➔ `[Object]`). Các khối từ dưới đất được mã hóa màu sắc (Xanh dương = Chủ ngữ, Đỏ = Động từ, Vàng = Tân ngữ). Người chơi phải gắp đúng thứ tự ngữ pháp. Hoàn thành xong phải đọc to cả câu.

### Chương 3: Đại Dương Phản Biện (Trình độ: Tiền trung cấp A2)
*   **Nhiệm vụ:** Nhận diện và sửa lỗi sai cấu trúc, dùng các thì phức tạp hơn (Tương lai, Hiện tại hoàn thành).
*   **Cơ chế:** Dưới đất xuất hiện các thùng gỗ chứa câu hoàn chỉnh (có câu đúng, câu sai). Người chơi phải dùng tư duy để né câu sai ngữ pháp, gắp chính xác câu đúng để ghi điểm. Cuối màn phải tự nói lại câu dựa trên trí nhớ (không nhìn chữ).

### Chương 4: Núi Lửa Phản Xạ Giao Tiếp (Trình độ: Trung cấp B1)
*   **Nhiệm vụ:** Nói tiếng Anh tự do theo ngữ cảnh, xóa bỏ tư duy dịch nhẩm từ tiếng Việt sang tiếng Anh.
*   **Cơ chế:** Đấu Boss. Boss AI tấn công bằng câu hỏi giao tiếp. Dưới đất là các cụm ý tưởng (Phrases/Collocations). Người chơi gắp cụm ý tưởng mình muốn trả lời, sau đó có 5 giây để tự nói một câu mở rộng hoàn chỉnh dựa trên cụm từ đó để hạ gục Boss.

---

## 4. CHIẾN LƯỢC NHIỀU NGƯỜI CHƠI (MULTIPLAYER)

*   **Chế độ PvP (Đua Tốc Độ):** 2-4 người chơi chung một bãi đào chữ và một câu hỏi. Tranh giành từ của nhau. Có thể dùng tính năng "Thả bom" (ném từ sai sang bài đối thủ) hoặc "Khóa Micro" để phá đám.
*   **Chế độ Co-op (Đồng Đội Săn Boss):** 2-4 người hợp sức tạo thành đội. Mỗi người đóng vai gắp một thành phần của câu (Người gắp Chủ ngữ, người gắp Động từ...). Khi gắp đủ câu, cả đội phải đồng thanh đọc to qua Micro để kích chiêu hạ gục Boss.

---

## 5. KIẾN TRÚC KỸ THUẬT KHUYẾN NGHỊ (TECHNICAL STACK)

*   **Game Engine & Ngôn ngữ:** TypeScript/JavaScript với **Phaser.js** hoặc **Babylon.js** (Tối ưu cho Web Game, chạy mượt trực tiếp trên trình duyệt qua WebGL).
*   **Xử lý giọng nói (Speech-to-Text):**
    *   *Giai đoạn MVP:* Tận dụng **Web Speech API** (`webkitSpeechRecognition`) có sẵn của trình duyệt (Hoàn toàn miễn phí).
    *   *Giai đoạn Thương mại:* Tích hợp **OpenAI Whisper API** hoặc **Azure Speech API** để nhận diện chính xác tiếng Anh theo accent của người Việt.
*   **Kết nối thời gian thực (Multiplayer):** Sử dụng **Node.js server** kết hợp **Socket.io** (hoặc WebSockets) để đồng bộ tọa độ góc móc và trạng thái từ vựng. Dùng **WebRTC (LiveKit/Agora)** để làm Voice Room giữa các người chơi.

### Ví dụ cấu trúc dữ liệu màn chơi (Level Data JSON):
```json
{
  "level_id": 102,
  "level_name": "Thì Quá Khứ Đơn - Khách sạn",
  "target_structure": "Subject + Verb(ed/V2) + Object",
  "hint_vietnamese": "Hôm qua, tôi đã đặt một căn phòng.",
  "time_limit": 60,
  "objects_underground": [
    { "text": "I", "type": "Subject", "is_correct": true, "x": 200, "y": 150, "weight": "light", "score": 10 },
    { "text": "She", "type": "Subject", "is_correct": false, "x": 100, "y": 150, "weight": "light", "score": -5 },
    { "text": "booked", "type": "Verb_V2", "is_correct": true, "x": 400, "y": 300, "weight": "heavy", "score": 50 },
    { "text": "book", "type": "Verb_V1", "is_correct": false, "x": 300, "y": 300, "weight": "heavy", "score": -20 },
    { "text": "a room", "type": "Object", "is_correct": true, "x": 600, "y": 450, "weight": "medium", "score": 30 }
  ]
}
```

---

## 6. CHIẾN LƯỢC PHÂN PHỐI & MARKETING (DÀNH CHO WEB GAME)

1.  **Phát hành đa cổng game:** Đưa game lên **Poki, CrazyGames, Y8 Games, itch.io** gắn tag `#Educational`, `#Puzzle` để hưởng lượng người dùng tự nhiên khổng lồ.
2.  **Đóng gói dạng Mini-App:** Tích hợp thành **Telegram Web App (TWA)** hoặc **Facebook Instant Games** giúp người chơi rủ bạn bè solo trực tiếp qua các nhóm chat một cách nhanh chóng.
3.  **Tạo vòng lặp lan truyền (Viral Loops):** Thưởng vật phẩm/lượt chơi khi rủ bạn bè; tạo tính năng xuất video ngắn 5 giây ghi lại cảnh người chơi vừa bắn tiếng Anh vừa hạ Boss để họ tự tin chia sẻ lên TikTok/Story Facebook.
4.  **Thâm nhập cộng đồng tự học:** Đăng bài chia sẻ dưới dạng lập trình viên tâm huyết tặng sản phẩm "Make in Vietnam" miễn phí cho các group học tiếng Anh để nhận phản hồi và tạo làn sóng ủng hộ tự nhiên.