编写手机支付功能的代码取决于你想要集成的支付方式（例如支付宝、微信支付、Apple Pay、Google Pay等）以及你正在开发的应用程序的平台（例如Android、iOS或Web）。以下是一些通用步骤和示例代码片段，用于指导如何开始集成一个简单的手机支付功能。

 1. 选择支付服务提供商

首先，选择一个或多个支付服务提供商，并注册成为开发者以获取API密钥和其他必要的凭证。

2. 集成SDK

支付服务提供商通常会提供SDK，你需要在你的应用中集成这些SDK。

对于Android（以集成微信支付为例）:

java
// 在build.gradle中添加依赖
dependencies {
    implementation 'com.tencent.mm.opensdk:wechat-sdk-android-without-mta:+'
}

// 初始化支付SDK
import com.tencent.mm.opensdk.openapi.IWXAPI;
import com.tencent.mm.opensdk.openapi.WXAPIFactory;

public class MyApplication extends Application {
    private IWXAPI api;
    
    @Override
    public void onCreate() {
        super.onCreate();
        
        // 将应用的appId注册到微信
        api = WXAPIFactory.createWXAPI(this, "你的appId", true);
        
        // 将应用注册到微信
        api.registerApp("你的appId");
    }
}


 对于iOS（以集成Apple Pay为例）:

在Xcode中，你需要启用Apple Pay的功能，并在你的应用中配置相应的merchant ID。

swift
import PassKit

let paymentRequest = PKPaymentRequest()
paymentRequest.merchantIdentifier = "你的merchantIdentifier"
paymentRequest.supportedNetworks = [.visa, .masterCard, .amex]
paymentRequest.merchantCapabilities = .capability3DS
paymentRequest.countryCode = "US"
paymentRequest.currencyCode = "USD"
paymentRequest.paymentSummaryItems = [
    PKPaymentSummaryItem(label: "商品名称", amount: NSDecimalNumber(string: "10.00"))
]

if PKPaymentAuthorizationViewController.canMakePayments() {
    let paymentAuthorizationViewController = PKPaymentAuthorizationViewController(paymentRequest: paymentRequest)
    self.present(paymentAuthorizationViewController, animated: true, completion: nil)
}
```

3. 处理支付结果

支付完成后，你需要处理支付服务提供商返回的结果。

 对于Android:

java
// 在你的Activity中重写onActivityResult方法
@Override
protected void onActivityResult(int requestCode, int resultCode, Intent data) {
    super.onActivityResult(requestCode, resultCode, data);
    
    if (requestCode == PAYMENT_REQUEST_CODE) {
        // 处理返回的支付结果
        if (resultCode == RESULT_OK) {
            // 支付成功
        } else {
            // 支付失败
        }
    }
}
```

对于iOS:

swift
extension YourViewController: PKPaymentAuthorizationViewControllerDelegate {

    func paymentAuthorizationViewControllerDidFinish(_ controller: PKPaymentAuthorizationViewController) {
        // 处理用户关闭支付界面的情况
        controller.dismiss(animated: true, completion: nil)
    }

    func paymentAuthorizationViewController(_ controller: PKPaymentAuthorizationViewController, didAuthorizePayment payment: PKPayment, completion: @escaping (PKPaymentAuthorizationStatus) -> Void) {
        // 发送支付token到服务器进行处理
        // 根据服务器返回的结果调用completion
        completion(.success)
    }
}


 4. 服务器端处理

通常，移动端发起支付请求后，需要将支付相关信息发送到服务器端。服务器端会与支付服务提供商进行通信，处理交易，并返回支付结果给移动端。

这些代码只是示例，具体实现时你需要阅读和遵循你选择的支付服务提供商提供的官方文档，处理安全性、错误处理、用户体验等方面的问题。