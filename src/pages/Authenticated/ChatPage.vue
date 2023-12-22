<script setup>
import { f7 } from 'framework7-vue';
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import ContactIllustration from '../../assets/illustrations/select_chat.svg';
import { useAuthStore } from '../../js/auth.store';
import { useTransactionStore } from '../../js/transaction.store';
import { usePostStore } from '../../js/post.store';
import InboxLayout from '../../Layout/InboxLayout.vue';
import database from '../../js/firestore';
import { collection, query, serverTimestamp, addDoc, where, doc, deleteDoc, onSnapshot, getDocs, orderBy, limit } from "firebase/firestore";

const authStore = useAuthStore();
const transactionStore = useTransactionStore();
const postStore = usePostStore();
const db = database;
const data = ref([]);
const messageData = ref([]);
const isChatSidebarOpen = ref(true);
const searchInput = ref(null);
const selectedImages = ref([]);
let resizeListener = null;

const FormData = ref({
    messageInput: null,
    inboxData: [],
});

const ReportForm = ref({
    to_report: null,
    message: null,
    proof_img_path: null,
});

// Render List of Inboxes
const renderInboxData = async () => {
    try {
        const inboxRef = collection(db, 'inbox');

        let inboxQuery = query(
            inboxRef,
            where('from_id', '==', authStore.user?.id),
            orderBy('created_at', 'desc')
        );

        onSnapshot(inboxQuery, async (querySnapshotFrom) => {
            const listDataFrom = querySnapshotFrom.docs.map((item) => ({
                id: item.id,
                item_name: item.data().item_name,
                from_id: item.data().from_id,
                from_user_fullname: item.data().from_user_fullname,
                to_id: item.data().to_id,
                to_user_fullname: item.data().to_user_fullname,
                post_item_key: item.data().post_item_key,
                inbox_key: item.data().inbox_key,
                thumbnail: item.data().thumbnail,
                created_at: item.data().created_at,
            }));

            inboxQuery = query(
                inboxRef,
                where('to_id', '==', authStore.user?.id),
                orderBy('created_at', 'desc')
            );

            onSnapshot(inboxQuery, async (querySnapshotTo) => {
                const listDataTo = querySnapshotTo.docs.map((item) => ({
                    id: item.id,
                    item_name: item.data().item_name,
                    from_id: item.data().from_id,
                    from_user_fullname: item.data().from_user_fullname,
                    to_id: item.data().to_id,
                    to_user_fullname: item.data().to_user_fullname,
                    post_item_key: item.data().post_item_key,
                    inbox_key: item.data().inbox_key,
                    thumbnail: item.data().thumbnail,
                    created_at: item.data().created_at,
                }));

                const combinedListData = [...listDataFrom, ...listDataTo];
                data.value = combinedListData;
            });
        });
    } catch (error) {
        console.error(error);
    }
};

// Get Messages Data By Inbox Key
const getMessageDataByInboxKey = async (msg_inbox_key, msgData) => {
    // Set the specific inbox data
    FormData.value.inboxData = msgData;

    const { inboxData } = FormData.value;

    // Set Report Name
    const loggedUserID = authStore.user?.id;
    ReportForm.value.to_report = inboxData.to_id === loggedUserID ? inboxData.from_user_fullname : inboxData.to_user_fullname;
    const messageRef = collection(db, 'message');

    const messageQuery = query(
        messageRef,
        where('msg_inbox_key', '==', msg_inbox_key),
        orderBy('created_at', 'desc')
    );

    try {
        onSnapshot(messageQuery, (querySnapshot) => {
            const messageList = querySnapshot.docs.map((doc) => {
                return {
                    id: doc.id,
                    msg_inbox_key: doc.data().msg_inbox_key,
                    from_id: doc.data().from_id,
                    from_user_fullname: doc.data().from_user_fullname,
                    to_id: doc.data().to_id,
                    to_user_fullname: doc.data().to_user_fullname,
                    message: doc.data().message,
                    test: doc.data().created_at,
                    created_at: doc.data().created_at ? formatMsgCreatedAt(doc.data().created_at.toDate()) : ' ',
                };
            });

            messageData.value = messageList;
        });

    } catch (error) {
        console.error('Error getting message data:', error);
    }
};


// Calculate the created_at date to ago
const formatMsgCreatedAt = (created_at) => {
    const now = new Date();
    const messageTime = new Date(created_at);

    // Check if created_at is a valid date
    if (isNaN(messageTime.getTime())) {
        return 'Invalid date';
    }

    const timeDiffInSeconds = Math.floor((now - messageTime) / 1000);

    if (timeDiffInSeconds >= 86400) {
        const daysAgo = Math.floor(timeDiffInSeconds / 86400);
        return `${daysAgo} ${daysAgo === 1 ? 'day' : 'days'} ago`;
    } else if (timeDiffInSeconds >= 3600) {
        const hoursAgo = Math.floor(timeDiffInSeconds / 3600);
        return `${hoursAgo} ${hoursAgo === 1 ? 'hour' : 'hours'} ago`;
    } else if (timeDiffInSeconds >= 60) {
        const minutesAgo = Math.floor(timeDiffInSeconds / 60);
        return `${minutesAgo} ${minutesAgo === 1 ? 'minute' : 'minutes'} ago`;
    } else {
        return `${timeDiffInSeconds} ${timeDiffInSeconds === 1 ? 'second' : 'seconds'} ago`;
    }
};

// Send Chat
const handleSendChat = async () => {
    const { inboxData } = FormData.value;
    const messageRef = collection(db, 'message');

    const loggedUserID = authStore.user?.id;
    const finalReceiverID = inboxData.to_id === loggedUserID ? inboxData.from_id : inboxData.to_id;
    const finalSenderID = inboxData.from_id === loggedUserID ? inboxData.from_id : inboxData.to_id;
    const finalReceiverName = inboxData.to_id === loggedUserID ? inboxData.from_user_fullname : inboxData.to_user_fullname;
    const finalSenderName = inboxData.from_id === loggedUserID ? inboxData.from_user_fullname : inboxData.to_user_fullname;

    try {
        const response = await addDoc(messageRef, {
            msg_inbox_key: inboxData.inbox_key,
            to_id: finalReceiverID,
            from_id: finalSenderID,
            from_user_fullname: finalSenderName,
            to_user_fullname: finalReceiverName,
            message: FormData.value.messageInput,
            created_at: serverTimestamp(),
        });

        if (response.id) {
            FormData.value.messageInput = null;
        }

    } catch (error) {
        console.error('Error sending message:', error);
    }
};

// Open Transaction
const OpenTransactions = async () => {
    const { inboxData } = FormData.value;
    const animate = window.innerWidth <= 1023;

    const response = await transactionStore.OpenTransactions(inboxData.to_id, inboxData.inbox_key);
    console.log(response);
    // Show the toast
    const toast = f7.toast.create({
        text: response.message,
        position: 'top',
        closeButton: true,
        closeButtonText: 'Okay',
        closeButtonColor: response.status == 'success' ? 'green' : 'red',
        closeTimeout: 3000,
    });

    toast.open();

    if (response.status == 'success') {
        // Add to Notification
        const messageNotif = 'started a new transaction.';
        doHandleNotification(messageNotif, inboxData.to_id);

        // If success
        f7.views.main.router.navigate('/order', {
            animate: animate,
        });
    }
};

// Handle Notification
const doHandleNotification = async (message, to_id) => {
    const notificationQuery = collection(db, 'notification');

    try {
        console.log(authStore.user?.id, authStore.user?.fullname);

        // Add new inbox
        const response = await addDoc(notificationQuery, {
            notified_to_id: to_id,
            notified_by_fullname: authStore.user?.fullname,
            message: message,
            is_read: false,
            type: 'inbox',
            created_at: serverTimestamp()
        });

        if (response.id) {
            console.log('notified');
        }
    } catch (error) {
        console.error(error);
    }
}

// Redirection to View item Details Page
const goToPostDetails = async () => {
    const { inboxData } = FormData.value;

    const PostItemKey = inboxData.post_item_key;
    const PostItemId = inboxData.post_item_key;

    const route = `/view/item/${PostItemId}`;
    const animate = window.innerWidth <= 1023;

    await postStore.GetPostDetails(PostItemKey);

    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

// Search Inbox Filter
const searchInboxFilter = computed(() => {
    const searchTerm = searchInput.value ? searchInput.value.toLowerCase() : '';

    return data.value.filter((item) => {
        const toUserFullname = item.to_user_fullname.toLowerCase();
        const fromUserFullname = item.from_user_fullname.toLowerCase();
        const loggedInUserId = authStore.user?.id;

        // Choose the correct user fullname based on the condition
        const userFullname = loggedInUserId === item.from_id ? toUserFullname : fromUserFullname;

        // Filter based on the chosen user fullname
        const isMatch = userFullname.includes(searchTerm);

        // Return true only if there is a match
        return isMatch;
    });
});

// Handle Report Image
const handleImageChange = (event) => {
    const files = Array.from(event.target.files);

    if (files.length == 0) {
        return;
    }

    // Filter files to only include JPG, JPEG, and PNG
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    const selectedFiles = files.filter((file) => allowedTypes.includes(file.type));

    // Initialize form.proof_img_path as an empty array if it's not already an array
    if (!Array.isArray(ReportForm.value.proof_img_path)) {
        ReportForm.value.proof_img_path = [];
    }

    // Append selectedFiles to the existing form.proof_img_path array
    ReportForm.value.proof_img_path = [...selectedFiles];

    // Display selected images
    selectedFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            selectedImages.value.push({ file, url: e.target.result });
        };
        reader.readAsDataURL(file);
    });
};

// Report User
const handleReportUser = async () => {
    const { message } = ReportForm.value;
    const loggedUserID = authStore.user?.id;
    // Create an array to store file data
    const files = [];

    if (!ReportForm.value.proof_img_path) {
        return;
    }

    // Convert File objects to base64 encoded strings
    for (const file of ReportForm.value.proof_img_path) {
        const reader = new FileReader();
        reader.readAsDataURL(file);

        await new Promise((resolve) => {
            reader.onload = (e) => {
                files.push({ name: file.name, data: e.target.result });
                resolve();
            };
        });
    }
    // Request
    const response = await authStore.reportUser(loggedUserID, message, files);

    // Show the toast
    const toast = f7.toast.create({
        text: response.message,
        position: 'top',
        closeButton: true,
        closeButtonText: 'Okay',
        closeButtonColor: response.status == 'success' ? 'green' : 'red',
        closeTimeout: 3000,
    });

    toast.open();

    if (response.status === 'success') {
        f7.popup.close('.popup-report');
        ReportForm.value.message = null;
        ReportForm.value.proof_img_path = null;
    }
};

const globalRender = async () => {
    updateSidebarByBreakpoint();
    resizeListener = window.addEventListener('resize', updateSidebarByBreakpoint);
};

const updateSidebarByBreakpoint = () => {
    isChatSidebarOpen.value = window.innerWidth > 1023;
};

const isChatSidebarToggle = () => {
    isChatSidebarOpen.value = !isChatSidebarOpen.value;
};

const goToPage = (route) => {
    const animate = window.innerWidth <= 1023;
    f7.views.main.router.navigate(route, {
        animate: animate,
    });
};

onMounted(() => {
    renderInboxData();
    globalRender();
});

onBeforeUnmount(() => {
    if (resizeListener) {
        window.removeEventListener('resize', updateSidebarByBreakpoint);
    }
});

</script>

<template>
    <f7-page class="chat-container">
        <InboxLayout>
            <!-- Start -- Contact List Section -->
            <section v-show="isChatSidebarOpen" class="w-1/4 bg-white border-r border-gray-300">
                <!-- Sidebar Header -->
                <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
                    <!-- Go To Home -->
                    <svg @click="goToPage('/')" class="cursor-pointer w-6 h-6 text-white" aria-hidden="true"
                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5"
                            d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9" />
                    </svg>
                    <!-- Header -->
                    <h1 class="text-2xl font-semibold text-center -ml-14">Inbox</h1>
                    <span></span>
                </div>

                <!-- Contact List Desktop -->
                <div class="overflow-y-auto h-screen p-3 mb-9 pb-20">
                    <!-- Search Contact -->
                    <div class="flex items-center -mb-4">
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 start-0 flex items-center p-3 pointer-events-none">
                                <svg class="z-50 w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input v-model="searchInput"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:sky-blue-800 focus:border-sky-800 block w-full ps-10 p-2.5"
                                placeholder="Search contacts" />
                        </div>
                    </div>

                    <!-- Contact List -->
                    <div v-if="searchInboxFilter.length > 0" v-for="inbox in searchInboxFilter" :key="inbox.id"
                        @click="getMessageDataByInboxKey(inbox.inbox_key, inbox)"
                        class="flex items-center mb-2 cursor-pointer p-2 rounded-md relative hover:bg-gray-100">
                        <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                            <img :src="inbox.thumbnail" alt="User Avatar" class="w-12 h-12 rounded-full">
                        </div>

                        <!-- Contact List -->
                        <div class="flex-1 truncate">
                            <h2 class="text-lg font-semibold truncate pr-8">{{ authStore.user?.id === inbox.from_id ?
                                inbox.to_user_fullname : inbox.from_user_fullname }} • {{ inbox.item_name }}</h2>
                            <p class="text-gray-600 truncate">Tap to chat</p>
                        </div>
                    </div>

                    <div v-else class="flex justify-center">
                        <p>No Contact Found.</p>
                    </div>
                </div>

                <!-- Contact List Mobile -->
                <f7-panel id="panel-nested" left cover container-el="#panel-page" class="w-full">
                    <div class="p-4 border-b border-gray-300 flex justify-between items-center bg-clr-primary text-white">
                        <!-- Close Side Panel -->
                        <f7-link panel-close>
                            <svg class="cursor-pointer w-[24px] h-[24px] text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5" d="M13 5H1m0 0 4 4M1 5l4-4" />
                            </svg>
                        </f7-link>
                        <!-- Header -->
                        <h1 class="text-xl font-semibold text-center -ml-8">Inbox</h1>
                        <!-- Go Back Home -->
                        <f7-link panel-close>
                            <svg @click="goToPage('/')" class="w-6 h-6 text-white" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M3 8v10a1 1 0 0 0 1 1h4v-5a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1v5h4a1 1 0 0 0 1-1V8M1 10l9-9 9 9" />
                            </svg>
                        </f7-link>
                    </div>

                    <!-- Search Contact -->
                    <div class="flex items-center p-2 -mb-10">
                        <div class="relative w-full">
                            <div class="absolute inset-y-0 start-0 flex items-center p-3 pointer-events-none">
                                <svg class="z-50 w-[18px] h-[18px] text-gray-800" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
                                </svg>
                            </div>
                            <input v-model="searchInput"
                                class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:sky-blue-800 focus:border-sky-800 block w-full ps-10 p-2.5"
                                placeholder="Search contacts" />
                        </div>
                    </div>

                    <!-- Contact List -->
                    <div class="overflow-y-auto h-screen p-2 mb-9 pb-20 mt-4">
                        <div v-if="searchInboxFilter.length > 0" v-for="inbox in searchInboxFilter" :key="inbox.id"
                            @click="getMessageDataByInboxKey(inbox.inbox_key, inbox)"
                            class="panel-close flex items-center mb-2 cursor-pointer p-2 rounded-md relative hover:bg-gray-100">
                            <div class="w-12 h-12 bg-gray-300 rounded-full mr-3">
                                <img :src="inbox.thumbnail" alt="User Avatar" class="w-12 h-12 rounded-full">
                            </div>
                            <!-- List -->
                            <div class="flex-1 truncate">
                                <h2 class="text-lg font-semibold truncate pr-8">{{ authStore.user?.id === inbox.from_id ?
                                    inbox.to_user_fullname : inbox.from_user_fullname }} • {{ inbox.item_name }}</h2>
                                <p class="text-gray-600 truncate">Tap to chat</p>
                            </div>
                        </div>

                        <div v-else class="flex justify-center">
                            <p>No Chat List Found.</p>
                        </div>
                    </div>
                </f7-panel>
            </section>
            <!-- End -- Contact List Section -->

            <!-- Start -- Main Chat Area -->
            <section v-if="messageData.length > 0" class="flex-1">
                <!-- Toggler -->
                <div class="bg-white p-4 text-gray-700 border-b border-gray-300 shadow flex flex-row gap-2">
                    <!-- Toggle Sidebar - Desktop -->
                    <f7-button @click="isChatSidebarToggle" class="hidden lg:block">
                        <div class="relative lg:mt-2 -ml-4 ">
                            <button class="focus:outline-none ">
                                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5" d="M1 1h14M1 6h14M1 11h7" />
                                </svg>
                            </button>
                        </div>
                    </f7-button>

                    <!-- Toggle Sidebar - Mobile -->
                    <f7-button panel-open="#panel-nested" class="block lg:hidden">
                        <div class="relative mt-2 -ml-5">
                            <button class="focus:outline-none">
                                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5" d="M1 1h14M1 6h14M1 11h7" />
                                </svg>
                            </button>
                        </div>
                    </f7-button>

                    <!-- Post Header Name -->
                    <div class="w-fit">
                        <div class="flex items-center gap-2">
                            <!-- Bag Icon -->
                            <!-- <svg class="w-[32px] h-[32px] text-clr-primary flex-shrink-0" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 18 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M12 9V4a3 3 0 0 0-6 0v5m9.92 10H2.08a1 1 0 0 1-1-1.077L2 6h14l.917 11.923A1 1 0 0 1 15.92 19Z" />
                            </svg>
                            <h1 class="text-clr-primary text-base lg:text-xl font-semibold">
                                <span>{{ messageData.from_user_fullname }}</span>
                            </h1> -->
                        </div>
                    </div>

                    <!-- Report User -->
                    <div class="ml-auto">
                        <f7-button tooltip="Report User" popup-open=".popup-report">
                            <svg class="w-[24px] h-[24px] text-gray-800 " aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 16 20">
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M1 1v18M1 3.652v9c5.6-5.223 8.4 2.49 14-.08v-9c-5.6 2.57-8.4-5.143-14 .08Z" />
                            </svg>
                        </f7-button>
                    </div>
                </div>

                <!-- Report Popup Form -->
                <f7-popup class="popup-report" swipe-to-close>
                    <f7-page>
                        <f7-navbar title="Report Form">
                            <f7-nav-right>
                                <f7-link popup-close>Close</f7-link>
                            </f7-nav-right>
                        </f7-navbar>

                        <div>
                            <f7-list>
                                <f7-block class="my-0">
                                    <p>User to Report:</p>
                                </f7-block>
                                <f7-list-input :label="ReportForm.to_report" outline floating-label type="text" disabled>
                                </f7-list-input>

                                <f7-list-input v-model:value="ReportForm.message" floating-label type="textarea"
                                    placeholder="Enter anything..." clear-button>
                                </f7-list-input>

                                <f7-block class="my-0 mt-3">
                                    <p>Proof of Report:</p>
                                    <input @change="handleImageChange" type="file" id="images" ref="fileInput" />
                                </f7-block>

                                <f7-block>
                                    <f7-button @click="handleReportUser" large fill
                                        class="primary-button">Submit</f7-button>
                                </f7-block>

                            </f7-list>
                        </div>
                    </f7-page>
                </f7-popup>

                <!-- CTA Action Component -->
                <div class="flex gap-2 bg-gray-100 shadow">
                    <div @click="OpenTransactions"
                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-4 rounded font-medium w-full text-center">
                        Open Transaction
                    </div>

                    <div @click="goToPostDetails"
                        class="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-4 rounded font-medium w-full text-center">
                        Item Details
                    </div>
                </div>

                <!-- Conversation -->
                <div class="h-screen flex flex-col-reverse overflow-y-auto p-4 pb-[13.5rem] sm:pb-[12rem] lg:pb-[12rem]">
                    <!-- Conversation -->
                    <div v-for="chat in messageData" class="flex flex-col mb-4"
                        :class="authStore.user?.id === chat.from_id ? 'items-end' : 'items-start'">
                        <p class="text-gray-600 text-sm ml-1 mb-1">{{ chat.to_id === chat.from_id ? chat.to_user_fullname :
                            chat.from_user_fullname }}</p>
                        <div class="flex flex-col max-w-96 text-white rounded-lg p-3 gap-3 w-full md:w-[600px] lg:w-[500px]"
                            :class="authStore.user?.id === chat.from_id ? 'bg-clr-primary' : 'bg-gray-100'">
                            <p class="break-all"
                                :class="chat.from_id == authStore.user?.id ? 'text-white' : 'text-gray-700'">{{ chat.message
                                }}</p>
                            <div class="flex flex-row items-center gap-2">
                                <svg class="w-[14px] h-[14px] text-gray-400" aria-hidden="true"
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                                    <path stroke="currentColor" stroke-linejoin="round" stroke-width="1.5"
                                        d="M10 6v4l3.276 3.276M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                                </svg>
                                <span class="text-gray-400">{{ chat.created_at }}</span>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Send Message -->
                <div class="bg-white border-t border-gray-300 p-4 absolute bottom-0 w-full lg:w-3/4">
                    <div class="flex items-center">
                        <!-- Add Image Attachment -->
                        <!-- <div class="mr-4 cursor-pointer">
                            <svg class="w-[24px] h-[24px] text-clr-primary" aria-hidden="true"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 18">
                                <path fill="currentColor"
                                    d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M18 1H2a1 1 0 0 0-1 1v14a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1Z" />
                                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                    stroke-width="1.5"
                                    d="M13 5.5a.5.5 0 1 1-1 0 .5.5 0 0 1 1 0ZM7.565 7.423 4.5 14h11.518l-2.516-3.71L11 13 7.565 7.423Z" />
                            </svg>
                        </div> -->
                        <!-- Add Message -->
                        <input v-model="FormData.messageInput" @keydown.enter="handleSendChat"
                            placeholder="Type a message..."
                            class="w-full p-2 rounded-full border border-gray-400 bg-gray-100" />

                        <!-- Send Message Event -->
                        <div @click="handleSendChat" class="ml-4 flex gap-2">
                            <button class="bg-clr-primary text-white px-4 py-2 rounded-md">Send</button>
                        </div>
                    </div>
                </div>
            </section>
            <!-- End -- Main Chat Area -->

            <!-- No Selected Contacts -->
            <section v-else class="flex-1 bg-gray-200">
                <!-- Toggler -->
                <div class="bg-white p-4 text-gray-700 border-b border-gray-300 shadow flex flex-row gap-2">
                    <!-- Toggle Sidebar - Desktop -->
                    <f7-button @click="isChatSidebarToggle" class="hidden lg:block">
                        <div class="relative lg:mt-2 -ml-4 ">
                            <button class="focus:outline-none ">
                                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5" d="M1 1h14M1 6h14M1 11h7" />
                                </svg>
                            </button>
                        </div>
                    </f7-button>

                    <!-- Toggle Sidebar - Mobile -->
                    <f7-button panel-open="#panel-nested" class="block lg:hidden">
                        <div class="relative mt-2 -ml-5">
                            <button class="focus:outline-none">
                                <svg class="w-6 h-6 text-dark" aria-hidden="true" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 16 12">
                                    <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"
                                        stroke-width="1.5" d="M1 1h14M1 6h14M1 11h7" />
                                </svg>
                            </button>
                        </div>
                    </f7-button>
                </div>

                <div class="flex flex-col justify-center items-center h-screen gap-8">
                    <h2 class="text-2xl font-bold text-center break-normal text-gray-500">Select a Contact to Message</h2>
                    <img width="200" :src="ContactIllustration">
                </div>
            </section>
        </InboxLayout>
    </f7-page>
</template>

<style scoped lang="scss">
.chat-container {
    background: #FFF;
    width: 100%;
    height: 100%;
}
</style>