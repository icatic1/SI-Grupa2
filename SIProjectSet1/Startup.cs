using SIProjectSet1.Infrastructure;
using SIProjectSet1;
using Microsoft.EntityFrameworkCore;
using SIProjectSet1.UserService;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SIProjectSet1.Settings;
using SIProjectSet1.LicenceService;
using SIProjectSet1.FilesService;
using Microsoft.AspNetCore.HttpOverrides;
using Microsoft.AspNetCore.Rewrite;

namespace SIProjectSet1
{
    public class Startup
    {
        public IConfiguration Configuration { get; }
        public IWebHostEnvironment HostingEnvironment { get; }

        public Startup(IConfiguration configuration, IWebHostEnvironment env)
        {
            Configuration = configuration;
            HostingEnvironment = env;
        }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            // I am literally registering this DB Context here, just so I can use EF Core Identity
            services.AddDbContext<SIProjectSet1Context>(options => options.UseSqlServer(Configuration.GetConnectionString("DefaultConnection")));

            services.AddDatabaseDeveloperPageExceptionFilter();

            services.AddControllers()
                .AddControllersAsServices();


            services.AddScoped<IUserService, UserService.UserService>();
            services.AddScoped<ILicenceService, LicenceService.LicenceService>();
            services.AddScoped<IFilesService, FilesService.FilesService>();
            //.AddNewtonsoftJson(options =>
            //{
            //    // To prevent "A possible object cycle was detected which is not supported" error
            //    options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore;

            //    // To get our property names serialized in the first letter lowercased
            //    options.SerializerSettings.ContractResolver = new CamelCasePropertyNamesContractResolver();
            //});

            services.AddIdentity<IdentityUser, IdentityRole>()
                .AddEntityFrameworkStores<SIProjectSet1Context>()
                .AddDefaultTokenProviders();

            // Adding Authentication  
            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultScheme = JwtBearerDefaults.AuthenticationScheme;
            })

            // Adding Jwt Bearer  
            .AddJwtBearer(options =>
            {
                options.SaveToken = true;
                options.RequireHttpsMetadata = false;
                options.TokenValidationParameters = new TokenValidationParameters()
                {
                    ValidateIssuer = true,
                    ValidateAudience = true,
                    ValidAudience = Configuration["JWT:ValidAudience"],
                    ValidIssuer = Configuration["JWT:ValidIssuer"],
                    ClockSkew = TimeSpan.Zero,
                    NameClaimType = "Roles",
                    RoleClaimType = "Roles",
                    IssuerSigningKey = new SymmetricSecurityKey(System.Text.Encoding.UTF8.GetBytes(Configuration["JWT:Secret"]))
                };
            });


            if (HostingEnvironment.IsDevelopment())
            {
                services.AddSwaggerGen();
                // SwaggerHelper.ConfigureService(services);
            }

            services.AddCors(options =>
                options.AddPolicy("MyPolicy",
                    builder =>
                    {
                        builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                    }
                )
            );
            services.Configure<MailSettings>(Configuration.GetSection("MailSettings"));
            services.AddTransient<IMailService, UserService.MailService>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }
            app.UseForwardedHeaders(new ForwardedHeadersOptions
            {
                ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto
            });
            app.UseHttpsRedirection();

            app.UseDefaultFiles();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseCors("MyPolicy");
            #region Swagger

            if (HostingEnvironment.IsDevelopment())
            {
                // Enable middleware to serve generated Swagger as a JSON endpoint.
                app.UseSwagger();

                // Enable middleware to serve swagger-ui (HTML, JS, CSS, etc.),
                // specifying the Swagger JSON endpoint.
                app.UseSwaggerUI(c =>
                {
                    //c.SwaggerEndpoint("/swagger/v1/swagger.json", "My API V1");
                    //c.RoutePrefix = "";
                });
            }

            #endregion

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });


        }
    }
}
