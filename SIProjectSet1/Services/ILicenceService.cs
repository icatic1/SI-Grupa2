using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using SIProjectSet1.Entities;
using SIProjectSet1.Infrastructure;
using SIProjectSet1.ViewModels;
using System;
using System.Collections.Generic;
using System.IdentityModel.Tokens.Jwt;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace SIProjectSet1.LicenceService
{
    public interface ILicenceService
    {
        Task<Licence> CheckLicence(String MacAddress);
        Task<Licence> GetTerminalAndDebug(String MacAddress);
        Task<bool> UpdateTerminalDebug(String MacAddress, String Terminal, Boolean Debug);
        Task<bool> InitialAddDevice(string macAddress, string terminalID, bool debugLog);
        Task<List<Licence>> GetAllLicences();
        Task<List<DeviceViewModel>> GetAllDevices();
        Task<Device> GetDevice(String MacAddress);
        Task<string> DeleteToken(string MacAddress);
        Task<bool> InitialAddDevice(String MacAddress, String Terminal);
        Task<string> GenerateToken(String MacAddress, IConfiguration configuration);
        Task<string> GetDeviceToken(String MacAddress);
    }

    public class LicenceService : ILicenceService
    {
        private readonly ILogger<LicenceService> _logger;
        private readonly SIProjectSet1Context _context;

        public LicenceService(ILogger<LicenceService> logger, SIProjectSet1Context context)
        {
            _logger = logger;
            _context = context;
        }

        public async Task<Licence> CheckLicence(String MacAddress)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            return licence;
        }

        public async Task<List<DeviceViewModel>> GetAllDevices()
        {
            var devices = await _context.Devices.ToListAsync();
            var deviceViewModels = new List<DeviceViewModel>();
            foreach (var d in devices)
            {
                DeviceViewModel deviceViewModel = new();
                deviceViewModel.MacAddress = d.MacAddress;
                deviceViewModel.TerminalID = d.TerminalID;
                var deviceToken = await GetDeviceToken(d.MacAddress);
                deviceViewModel.IsActivated = (deviceToken != null && deviceToken != "");
                deviceViewModels.Add(deviceViewModel);
            }
            return deviceViewModels;
        }

        public async Task<List<Licence>> GetAllLicences()
        {
            var licence = await _context.Licences.ToListAsync();
            return licence;
        }

        public async Task<Device> GetDevice(String MacAddress)
        {
            var device = await _context.Devices.FirstOrDefaultAsync(device => device.MacAddress == MacAddress);
            return device;
        }

        public async Task<Licence> GetTerminalAndDebug(String MacAddress)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            return licence;
        }

        public async Task<bool> UpdateTerminalDebug(String MacAddress, String Terminal, Boolean Debug)
        {
            var licence = await _context.Licences.FirstOrDefaultAsync(licence => licence.MacAddress == MacAddress);
            if (licence == null) return false;

            licence.TerminalID = Terminal;
            licence.DebugLog = Debug;
            await _context.SaveChangesAsync();

            return true;
        }

        public async Task<bool> InitialAddDevice(String MacAddress, String Terminal, Boolean Debug)
        {
            try
            {
                var licence = new Licence() { MacAddress = MacAddress, TerminalID = Terminal, DebugLog = Debug, Licenced = false };
                _context.Licences.Add(licence);
                var device = new Device() { MacAddress = MacAddress, TerminalID = Terminal};
                _context.Devices.Add(device);
                await _context.SaveChangesAsync();

                return true;
            } catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<bool> InitialAddDevice(String MacAddress, String Terminal)
        {
            try
            {
                var device = new Device() { MacAddress = MacAddress, TerminalID = Terminal };
                _context.Devices.Add(device);
                await _context.SaveChangesAsync();
                return true;
            }
            catch (Exception ex)
            {
                return false;
            }
        }

        public async Task<string> GenerateToken(String MacAddress, IConfiguration configuration)
        {
            try
            {
                var token = GetToken(MacAddress, configuration);
                var tok = new JwtSecurityTokenHandler().WriteToken(token); 
                var exp = token.ValidTo.ToString();
                var deviceToken = new DeviceToken() { MacAddress = MacAddress, Token = tok, TokenExpiration = exp };
                await _context.DeviceTokens.AddAsync(deviceToken);
                await _context.SaveChangesAsync();

                return tok.ToString();

            } catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<string> GetDeviceToken(String MacAddress)
        {
            try
            {
                var deviceToken = await _context.DeviceTokens.FirstOrDefaultAsync(deviceToken => deviceToken.MacAddress == MacAddress);
                if (deviceToken == null) return null;
                return deviceToken.Token;
            } catch (Exception ex)
            {
                return null;
            }
        }

        public async Task<string> DeleteToken(string MacAddress)
        {
            try
            {
                DeviceToken deviceToken = _context.DeviceTokens.FirstOrDefault(deviceToken => deviceToken.MacAddress == MacAddress);
                while (deviceToken != null)
                {
                    _context.DeviceTokens.Remove(deviceToken);
                    _context.SaveChanges();
                    deviceToken = _context.DeviceTokens.FirstOrDefault(deviceToken => deviceToken.MacAddress == MacAddress);
                }
                return "OK";
            }
            catch (Exception ex)
            {
                return null;
            }
        }


        private JwtSecurityToken GetToken(string MacAddress, IConfiguration configuration)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(configuration["JWT:Secret"]));



            var token = new JwtSecurityToken(
                issuer: configuration["JWT:ValidIssuer"],
                audience: configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddMinutes(30),
                //claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            token.Payload["MacAddress"] = MacAddress;

            return token;
        }



    }
}
