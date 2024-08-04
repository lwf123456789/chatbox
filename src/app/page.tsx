"use client";
import ChatBox from "@/components/ChatBox"

const Messages: React.FC = () => {
  const messages = [
    { sender: "产品经理", message: "我们这个月的项目进度怎么样了？", time: "上午9:00", self: false },
    { sender: "自己", message: "目前进展顺利，后端部分已经完成了70%，前端部分完成了60%。", time: "上午9:05", self: true },
    { sender: "产品经理", message: "很好，我们可能需要在首页增加一个新的功能模块。", time: "上午9:10", self: false },
    { sender: "自己", message: "可以详细说明一下这个模块的具体需求吗？", time: "上午9:15", self: true },
    { sender: "产品经理", message: "这个模块主要展示用户的个性化推荐内容，内容来源是用户的浏览历史和购买记录。", time: "上午9:20", self: false },
    { sender: "自己", message: "明白了，我会先做一下需求分析，看看需要调整哪些现有的功能。", time: "上午9:25", self: true },
    { sender: "产品经理", message: "好的，另外，我们可以考虑使用新的前端框架吗？我听说React 18性能更好。", time: "上午9:30", self: false },
    { sender: "自己", message: "是的，React 18在并发模式下有更好的性能表现，我建议我们可以在新功能上试用一下。", time: "上午9:35", self: true },
    { sender: "产品经理", message: "那就按照这个计划进行吧，有什么需要我支持的，随时联系我。", time: "上午9:40", self: false },
    { sender: "自己", message: "好的，我会定期汇报进度。", time: "上午9:45", self: true },
  ];
  

  return (
    <div className="overflow-hidden">
      <ChatBox
        messages={messages}
        avatarSrc="https://png.pngtree.com/thumb_back/fh260/background/20230408/pngtree-robot-white-cute-robot-blue-light-background-image_2199825.jpg"
        title="Robot AI"
        subtitle="随时联系我"
        width="500px"
        height="900px"
      />
    </div>
  );
};

export default Messages;
