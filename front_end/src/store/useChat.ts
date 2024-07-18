import { IChatSetting } from '@/utils/types';
/*
 * @Author: 祝占朋 wb.zhuzhanpeng01@mesg.corp.netease.com
 * @Date: 2024-01-09 15:28:56
 * @LastEditors: 李浩坤 lihaokun@corp.netease.com
 * @LastEditTime: 2024-07-18 18:00:00
 * @FilePath: /QAnything/front_end/src/store/useChat.ts
 * @Description: 注意，修改这里的配置参数时一定要清除localStorage缓存
 */
export const useChat = defineStore(
  'useChat',
  () => {
    const showModal = ref(false);

    // 模型配置弹窗
    const showSettingModal = ref(false);

    // 模型配置参数
    const chatSettingFormBase: IChatSetting = {
      modelType: '',
      apiKey: '',
      apiBase: '',
      apiModelName: '',
      apiContextLength: 0,
      maxToken: 0,
      context: 0,
      temperature: 0.5,
      top_P: 1,
      capabilities: {
        onlineSearch: false,
        mixedSearch: false,
        onlySearch: false,
      },
      active: false,
    };

    // 配置好的模型，包括 openAi Ollama 自定义
    const chatSettingConfigured = ref<IChatSetting[]>([
      {
        ...chatSettingFormBase,
        modelType: 'openAI',
        active: false, // 默认openAi
      },
      {
        ...chatSettingFormBase,
        modelType: 'ollama',
        active: true,
      },
      {
        ...chatSettingFormBase,
        modelName: '',
        modelType: '自定义模型配置',
        customId: 0,
        active: false,
      },
    ]);
    const setChatSettingConfigured = (chatSetting: IChatSetting) => {
      console.log('chatSetting-------', chatSetting);
      // 先把所有active设置为false;
      chatSettingConfigured.value.forEach(item => {
        item.active = false;
      });
      // 再把当前的active设置为true
      chatSetting.active = true;
      if (chatSetting.modelType === 'openAI') {
        chatSettingConfigured.value[0] = chatSetting;
      } else if (chatSetting.modelType === 'ollama') {
        chatSettingConfigured.value[1] = chatSetting;
      } else {
        debugger;
        // 自定义
        chatSetting.modelType = chatSetting.modelName;
        const index = chatSettingConfigured.value.findIndex(
          item => item.customId === chatSetting.customId
        );
        if (index !== -1 && chatSetting.customId !== 0) {
          // 找到相同 id 的自定义，替换
          chatSettingConfigured.value[index] = chatSetting;
        } else {
          // 没有找到相同 id 的自定义或为第一个，添加
          chatSetting.customId = chatSettingConfigured.value.at(-1).customId + 1;
          chatSettingConfigured.value.push(chatSetting);
        }
      }
    };

    return {
      showModal,
      showSettingModal,
      setChatSettingConfigured,
      chatSettingConfigured,
    };
  },
  {
    persist: {
      storage: localStorage,
    },
  }
);
